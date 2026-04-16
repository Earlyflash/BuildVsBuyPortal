import { z } from "zod";
import type { AssessmentInputs } from "@/domain/assessment";

export const MAX_ASSESSMENT_REQUEST_BYTES = 24_000;

const likertScoreSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

const strategicValueSchema = z
  .object({
    competitiveDifferentiation: likertScoreSchema,
    capabilityBuilding: likertScoreSchema,
    uniqueBusinessProcess: likertScoreSchema,
  })
  .strict();

const deliveryConstraintsSchema = z
  .object({
    timeToMarketUrgency: likertScoreSchema,
    complianceRequirements: likertScoreSchema,
    securitySensitivity: likertScoreSchema,
  })
  .strict();

const economicsAndRiskSchema = z
  .object({
    totalCostHorizon: likertScoreSchema,
    integrationComplexity: likertScoreSchema,
    vendorLockInTolerance: likertScoreSchema,
    internalCapability: likertScoreSchema,
  })
  .strict();

const decisionGatesSchema = z
  .object({
    strategicDifferentiation: z.boolean(),
    dataPrivacyTopPriority: z.boolean(),
    enoughTalentAndBudget: z.boolean(),
    heavyCustomizationAndControl: z.boolean(),
    urgentTimeToMarket: z.boolean(),
    acceptInnovationRisk: z.boolean(),
    showStopperNotes: z.string().trim().max(1500),
  })
  .strict();

export const assessmentInputSchema = z
  .object({
    projectName: z.string().trim().min(1).max(140),
    projectDescription: z.string().trim().max(5_000),
    llmOptIn: z.boolean(),
    strategicValue: strategicValueSchema,
    deliveryConstraints: deliveryConstraintsSchema,
    economicsAndRisk: economicsAndRiskSchema,
    decisionGates: decisionGatesSchema,
  })
  .strict();

export function parseAssessmentInputs(raw: unknown):
  | { ok: true; data: AssessmentInputs }
  | { ok: false; error: string } {
  const parsed = assessmentInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid assessment payload" };
  }

  return { ok: true, data: parsed.data };
}
