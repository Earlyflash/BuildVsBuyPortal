import type { ScoringResult } from "@/domain/recommendation";

interface RationaleRequest {
  projectName: string;
  projectDescription: string;
  scoring: ScoringResult;
}

export interface RationaleResult {
  text: string;
  prompt: string;
  source: "gemini" | "fallback";
  status: "ok" | "fallback";
  error: string | null;
}

export async function generateRationale(
  request: RationaleRequest,
): Promise<RationaleResult> {
  const prompt = buildPrompt(request);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      text: buildFallbackRationale(request),
      prompt,
      source: "fallback",
      status: "fallback",
      error: "Missing GEMINI_API_KEY",
    };
  }

  const model = process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite-preview";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600,
          },
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      return {
        text: buildFallbackRationale(request),
        prompt,
        source: "fallback",
        status: "fallback",
        error: `Gemini API error (${response.status}): ${errorBody.slice(0, 250)}`,
      };
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.output_text;

    if (typeof text === "string" && text.trim().length > 0) {
      return {
        text: sanitizeModelRationale(text),
        prompt,
        source: "gemini",
        status: "ok",
        error: null,
      };
    }

    return {
      text: buildFallbackRationale(request),
      prompt,
      source: "fallback",
      status: "fallback",
      error: "Gemini returned no text content",
    };
  } catch (error) {
    return {
      text: buildFallbackRationale(request),
      prompt,
      source: "fallback",
      status: "fallback",
      error: error instanceof Error ? error.message : "Unknown Gemini failure",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function buildPrompt(req: RationaleRequest): string {
  const { projectName, projectDescription, scoring } = req;
  const drivers = scoring.topDrivers
    .map((d) => `${d.label} (score ${d.rawScore}/5, weight ${d.weight})`)
    .join("; ");
  const bucketSummaries = scoring.buckets
    .map((b) => `${b.label}: ${b.percentage}%`)
    .join("; ");

  return `You are a technology strategy advisor for the UK Ministry of Justice.

A team is evaluating whether to buy or build: "${projectName}".
Description: ${projectDescription || "Not provided."}

The deterministic scoring model produced:
- Overall score: ${scoring.percentage}% (recommendation: ${scoring.band})
- Weighted-score band: ${scoring.weightedBand}
- Decision-gate band: ${scoring.gateBand}
- Bucket scores: ${bucketSummaries}
- Top drivers: ${drivers}
- Decision-gate explanation: ${scoring.gateExplanation}
- Decision-gate signals: ${scoring.gateSignals.join("; ")}

Output requirements (strict):
- Do NOT write as an email.
- Do NOT include greetings, salutations, or sign-offs (for example: "Hi", "Dear", "Regards", "Best", "Thanks").
- Do NOT include a subject line.
- Write in plain report style using short headings and bullet points.
- Preserve line breaks with clear spacing between sections.

Write a concise rationale explaining why the "${scoring.band}" recommendation makes sense for this project. Include:
1) "Recommendation summary"
2) "Why this recommendation"
3) "Risks and trade-offs"
4) "Suggested next actions"

Reference the specific factors and gate signals, and interpret the data rather than repeating raw numbers verbatim.`;
}

function buildFallbackRationale(req: RationaleRequest): string {
  const { projectName, scoring } = req;
  const drivers = scoring.topDrivers
    .map((driver) => `${driver.label} (${driver.rawScore}/5)`)
    .join(", ");

  return [
    `A Gemini-generated narrative is currently unavailable, so this is an automatic fallback summary for "${projectName}".`,
    `The overall recommendation is ${scoring.band} based on a weighted score of ${scoring.percentage}% and a decision-gate outcome of ${scoring.gateBand}.`,
    `Key drivers are ${drivers}. ${scoring.gateExplanation}`,
    "Use this summary as a temporary explanation while Gemini connectivity or configuration is resolved.",
  ].join("\n\n");
}

function sanitizeModelRationale(text: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const emailLikePrefixes = [
    "hi",
    "hello",
    "dear",
    "subject:",
    "to:",
    "from:",
    "regards",
    "kind regards",
    "best regards",
    "best,",
    "thanks,",
    "thank you,",
    "sincerely",
  ];

  const filtered = lines.filter((line) => {
    const lower = line.toLowerCase();
    return !emailLikePrefixes.some((prefix) => lower.startsWith(prefix));
  });

  const cleaned = filtered.join("\n\n").trim();
  return cleaned.length > 0 ? cleaned : text.trim();
}
