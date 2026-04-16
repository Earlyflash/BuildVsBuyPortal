import { NextResponse, type NextRequest } from "next/server";
import type { Recommendation } from "@/domain/recommendation";
import { scoreAssessment } from "@/server/scoringEngine";
import { generateRationale } from "@/server/rationaleService";
import { getClientIdentity } from "@/server/security/clientIdentity";
import {
  MAX_ASSESSMENT_REQUEST_BYTES,
  parseAssessmentInputs,
} from "@/server/security/requestSchema";
import { consumeRateLimit } from "@/server/security/rateLimit";

function getPositiveIntEnv(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getApiRatePolicy() {
  return {
    windowMs: getPositiveIntEnv("ASSESS_RATE_LIMIT_WINDOW_MS", 60_000),
    maxRequests: getPositiveIntEnv("ASSESS_RATE_LIMIT_MAX_REQUESTS", 30),
  };
}

function getLlmRatePolicy() {
  return {
    windowMs: getPositiveIntEnv("LLM_RATE_LIMIT_WINDOW_MS", 60_000),
    maxRequests: getPositiveIntEnv("LLM_RATE_LIMIT_MAX_REQUESTS", 10),
  };
}

function jsonError(
  error: string,
  status: number,
  headers?: HeadersInit,
) {
  return NextResponse.json({ error }, { status, headers });
}

function isJsonContentType(contentType: string | null): boolean {
  return typeof contentType === "string" && contentType.includes("application/json");
}

export async function POST(request: NextRequest) {
  if (!isJsonContentType(request.headers.get("content-type"))) {
    return jsonError("Content-Type must be application/json", 415);
  }

  const clientIdentity = getClientIdentity(request);
  const apiRate = consumeRateLimit(`assess:${clientIdentity}`, getApiRatePolicy());
  if (!apiRate.allowed) {
    return jsonError("Too many requests. Please retry shortly.", 429, {
      "Retry-After": apiRate.retryAfterSeconds.toString(),
    });
  }

  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return jsonError("Invalid request body", 400);
  }

  const requestBytes = new TextEncoder().encode(rawBody).length;
  if (requestBytes > MAX_ASSESSMENT_REQUEST_BYTES) {
    return jsonError("Request payload is too large", 413);
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return jsonError("Invalid JSON in request body", 400);
  }

  const validated = parseAssessmentInputs(parsedBody);
  if (!validated.ok) {
    return jsonError(`Invalid assessment payload: ${validated.error}`, 422);
  }

  const inputs = validated.data;
  const scoring = scoreAssessment(inputs);

  let llmOptIn = inputs.llmOptIn;
  let fallbackReasonOverride: string | undefined;
  if (inputs.llmOptIn) {
    const llmRate = consumeRateLimit(`llm:${clientIdentity}`, getLlmRatePolicy());
    if (!llmRate.allowed) {
      llmOptIn = false;
      fallbackReasonOverride = "LLM_RATE_LIMITED";
    }
  }

  const rationale = await generateRationale({
    projectName: inputs.projectName,
    projectDescription: inputs.projectDescription,
    scoring,
    llmOptIn,
    fallbackReasonOverride,
  });

  const exposePrompt = process.env.EXPOSE_RATIONALE_PROMPT === "true";
  const recommendation: Recommendation = {
    scoring,
    rationale: rationale.text,
    rationalePrompt: exposePrompt ? rationale.prompt : "",
    rationaleSource: rationale.source,
    rationaleStatus: rationale.status,
    rationaleError: rationale.error,
    generatedAt: new Date().toISOString(),
    projectName: inputs.projectName,
  };

  return NextResponse.json(recommendation, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
