import { afterEach, describe, expect, it, vi } from "vitest";
import { generateRationale } from "./rationaleService";

const baseRequest = {
  projectName: "Case tools",
  projectDescription: "Simple service modernisation work.",
  llmOptIn: true,
  scoring: {
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
  },
};

describe("generateRationale", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_MODEL;
  });

  it("fails closed when user has not opted in", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await generateRationale({
      ...baseRequest,
      llmOptIn: false,
    });

    expect(result.status).toBe("fallback");
    expect(result.error).toBe("LLM_OPT_OUT");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("blocks high sensitivity content from external calls", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await generateRationale({
      ...baseRequest,
      projectDescription: "Contains National Insurance number AB123456C.",
    });

    expect(result.status).toBe("fallback");
    expect(result.error).toBe("SENSITIVITY_BLOCKED");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns sanitized upstream error code", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("provider internals", { status: 503 })),
    );

    const result = await generateRationale(baseRequest);

    expect(result.status).toBe("fallback");
    expect(result.error).toBe("UPSTREAM_UNAVAILABLE");
  });
});
