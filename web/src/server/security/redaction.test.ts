import { describe, expect, it } from "vitest";
import {
  classifySensitivity,
  redactSensitiveTokens,
} from "./redaction";

describe("redaction", () => {
  it("redacts secret-like values and emails", () => {
    const input =
      "Contact owner@example.com and use api_key=abcd1234 for bootstrap.";
    const output = redactSensitiveTokens(input);

    expect(output).not.toContain("owner@example.com");
    expect(output).toContain("[REDACTED_EMAIL]");
    expect(output).toContain("[REDACTED_SECRET]");
  });

  it("classifies high-sensitivity content", () => {
    const sensitivity = classifySensitivity(
      "National Insurance number AB123456C should not be shared.",
    );
    expect(sensitivity).toBe("high");
  });

  it("classifies low-sensitivity content", () => {
    const sensitivity = classifySensitivity("Project requires standard workflow automation.");
    expect(sensitivity).toBe("low");
  });
});
