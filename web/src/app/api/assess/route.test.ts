import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { resetRateLimitState } from "@/server/security/rateLimit";

const mockScoringResult = {
  overallScore: 300,
  maxPossibleScore: 500,
  percentage: 60,
  band: "Investigate" as const,
  weightedBand: "Investigate" as const,
  gateBand: "Investigate" as const,
  factors: [],
  buckets: [],
  topDrivers: [],
  gateSignals: [],
  gateExplanation: "Mixed signals",
};

const mockGenerateRationale = vi.fn(async () => ({
  text: "Fallback narrative",
  prompt: "Prompt",
  source: "fallback" as const,
  status: "fallback" as const,
  error: "LLM_OPT_OUT",
}));

vi.mock("@/server/scoringEngine", () => ({
  scoreAssessment: vi.fn(() => mockScoringResult),
}));

vi.mock("@/server/rationaleService", () => ({
  generateRationale: mockGenerateRationale,
}));

const validPayload = {
  projectName: "Case management",
  projectDescription: "A standard test description",
  llmOptIn: false,
  strategicValue: {
    competitiveDifferentiation: 3,
    capabilityBuilding: 3,
    uniqueBusinessProcess: 3,
  },
  deliveryConstraints: {
    timeToMarketUrgency: 3,
    complianceRequirements: 3,
    securitySensitivity: 3,
  },
  economicsAndRisk: {
    totalCostHorizon: 3,
    integrationComplexity: 3,
    vendorLockInTolerance: 3,
    internalCapability: 3,
  },
  decisionGates: {
    strategicDifferentiation: false,
    dataPrivacyTopPriority: false,
    enoughTalentAndBudget: true,
    heavyCustomizationAndControl: false,
    urgentTimeToMarket: true,
    acceptInnovationRisk: true,
    showStopperNotes: "",
  },
};

describe("POST /api/assess", () => {
  beforeEach(() => {
    resetRateLimitState();
    vi.resetModules();
    vi.clearAllMocks();

    process.env.ASSESS_RATE_LIMIT_MAX_REQUESTS = "30";
    process.env.ASSESS_RATE_LIMIT_WINDOW_MS = "60000";
    process.env.LLM_RATE_LIMIT_MAX_REQUESTS = "10";
    process.env.LLM_RATE_LIMIT_WINDOW_MS = "60000";
  });

  afterEach(() => {
    delete process.env.ASSESS_RATE_LIMIT_MAX_REQUESTS;
    delete process.env.ASSESS_RATE_LIMIT_WINDOW_MS;
    delete process.env.LLM_RATE_LIMIT_MAX_REQUESTS;
    delete process.env.LLM_RATE_LIMIT_WINDOW_MS;
  });

  it("rejects non-json content types", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/assess", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "hello",
    });

    const response = await POST(request as unknown as NextRequest);
    expect(response.status).toBe(415);
  });

  it("rejects invalid payload schema", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/assess", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...validPayload,
        strategicValue: {
          ...validPayload.strategicValue,
          competitiveDifferentiation: 99,
        },
      }),
    });

    const response = await POST(request as unknown as NextRequest);
    expect(response.status).toBe(422);
  });

  it("rejects oversized payloads", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/assess", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...validPayload,
        projectDescription: "x".repeat(30_000),
      }),
    });

    const response = await POST(request as unknown as NextRequest);
    expect(response.status).toBe(413);
  });

  it("returns 429 when endpoint request rate limit is exceeded", async () => {
    process.env.ASSESS_RATE_LIMIT_MAX_REQUESTS = "1";
    process.env.ASSESS_RATE_LIMIT_WINDOW_MS = "120000";

    const { POST } = await import("./route");
    const request = () =>
      new Request("http://localhost/api/assess", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validPayload),
      });

    const first = await POST(request() as unknown as NextRequest);
    const second = await POST(request() as unknown as NextRequest);

    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
  });
});
