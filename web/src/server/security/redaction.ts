const HIGH_SENSITIVITY_PATTERNS = [
  /\b(passport|national insurance|ni number|date of birth|dob)\b/i,
  /\b([A-Z]{2}\d{6}[A-D])\b/, // UK National Insurance Number
  /\b(?:\d[ -]*?){13,19}\b/, // potential payment card number
  /\b(?:api[_-]?key|secret|private[_-]?key|token)\b\s*[:=]\s*\S+/i,
];

const MEDIUM_SENSITIVITY_PATTERNS = [
  /\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/, // email
  /\bhttps?:\/\/\S+/i,
  /\b(account|credential|password|tenant|customer)\b/i,
];

const REDACTION_RULES: Array<{ pattern: RegExp; replacement: string }> = [
  {
    pattern: /\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g,
    replacement: "[REDACTED_EMAIL]",
  },
  {
    pattern: /\b(?:api[_-]?key|secret|private[_-]?key|token)\b\s*[:=]\s*\S+/gi,
    replacement: "[REDACTED_SECRET]",
  },
  {
    pattern: /\b(?:\d[ -]*?){13,19}\b/g,
    replacement: "[REDACTED_NUMBER]",
  },
];

export type SensitivityLevel = "low" | "medium" | "high";

export function classifySensitivity(text: string): SensitivityLevel {
  if (HIGH_SENSITIVITY_PATTERNS.some((pattern) => pattern.test(text))) {
    return "high";
  }

  if (MEDIUM_SENSITIVITY_PATTERNS.some((pattern) => pattern.test(text))) {
    return "medium";
  }

  return "low";
}

export function redactSensitiveTokens(text: string): string {
  return REDACTION_RULES.reduce(
    (result, rule) => result.replace(rule.pattern, rule.replacement),
    text,
  );
}
