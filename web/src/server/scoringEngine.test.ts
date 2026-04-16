import { describe, it, expect } from "vitest";
import { scoreAssessment } from "./scoringEngine";
import type { AssessmentInputs } from "@/domain/assessment";
import { TOTAL_WEIGHT } from "@/domain/scoringConfig";

function makeInputs(
  overrides: Partial<{
    strategicValue: Partial<AssessmentInputs["strategicValue"]>;
    deliveryConstraints: Partial<AssessmentInputs["deliveryConstraints"]>;
    economicsAndRisk: Partial<AssessmentInputs["economicsAndRisk"]>;
    decisionGates: Partial<AssessmentInputs["decisionGates"]>;
  }> = {},
): AssessmentInputs {
  return {
    projectName: "Test Project",
    projectDescription: "A test project",
    strategicValue: {
      competitiveDifferentiation: 3,
      capabilityBuilding: 3,
      uniqueBusinessProcess: 3,
      ...overrides.strategicValue,
    },
    deliveryConstraints: {
      timeToMarketUrgency: 3,
      complianceRequirements: 3,
      securitySensitivity: 3,
      ...overrides.deliveryConstraints,
    },
    economicsAndRisk: {
      totalCostHorizon: 3,
      integrationComplexity: 3,
      vendorLockInTolerance: 3,
      internalCapability: 3,
      ...overrides.economicsAndRisk,
    },
    decisionGates: {
      strategicDifferentiation: true,
      dataPrivacyTopPriority: false,
      enoughTalentAndBudget: false,
      heavyCustomizationAndControl: true,
      urgentTimeToMarket: true,
      acceptInnovationRisk: false,
      showStopperNotes: "",
      ...overrides.decisionGates,
    },
  };
}

describe("scoreAssessment", () => {
  it("returns 60% for all-3 inputs (midpoint)", () => {
    const result = scoreAssessment(makeInputs());
    expect(result.percentage).toBe(60);
    expect(result.maxPossibleScore).toBe(TOTAL_WEIGHT * 5);
  });

  it("returns Buy for all-1 inputs", () => {
    const inputs = makeInputs({
      strategicValue: {
        competitiveDifferentiation: 1,
        capabilityBuilding: 1,
        uniqueBusinessProcess: 1,
      },
      deliveryConstraints: {
        timeToMarketUrgency: 1,
        complianceRequirements: 1,
        securitySensitivity: 1,
      },
      economicsAndRisk: {
        totalCostHorizon: 1,
        integrationComplexity: 1,
        vendorLockInTolerance: 1,
        internalCapability: 1,
      },
    });
    const result = scoreAssessment(inputs);
    expect(result.band).toBe("Buy");
    expect(result.percentage).toBe(20);
  });

  it("returns Build for all-5 inputs", () => {
    const inputs = makeInputs({
      strategicValue: {
        competitiveDifferentiation: 5,
        capabilityBuilding: 5,
        uniqueBusinessProcess: 5,
      },
      deliveryConstraints: {
        timeToMarketUrgency: 5,
        complianceRequirements: 5,
        securitySensitivity: 5,
      },
      economicsAndRisk: {
        totalCostHorizon: 5,
        integrationComplexity: 5,
        vendorLockInTolerance: 5,
        internalCapability: 5,
      },
    });
    const result = scoreAssessment(inputs);
    expect(result.band).toBe("Build");
    expect(result.percentage).toBe(100);
  });

  it("returns Investigate for mixed inputs near boundary", () => {
    const inputs = makeInputs({
      strategicValue: {
        competitiveDifferentiation: 2,
        capabilityBuilding: 3,
        uniqueBusinessProcess: 3,
      },
      deliveryConstraints: {
        timeToMarketUrgency: 2,
        complianceRequirements: 3,
        securitySensitivity: 2,
      },
      economicsAndRisk: {
        totalCostHorizon: 2,
        integrationComplexity: 3,
        vendorLockInTolerance: 3,
        internalCapability: 3,
      },
    });
    const result = scoreAssessment(inputs);
    expect(result.band).toBe("Investigate");
  });

  it("factors have correct count (10 criteria)", () => {
    const result = scoreAssessment(makeInputs());
    expect(result.factors).toHaveLength(10);
  });

  it("provides exactly 3 top drivers", () => {
    const result = scoreAssessment(makeInputs());
    expect(result.topDrivers).toHaveLength(3);
  });

  it("bucket percentages are between 0 and 100", () => {
    const result = scoreAssessment(makeInputs());
    for (const bucket of result.buckets) {
      expect(bucket.percentage).toBeGreaterThanOrEqual(0);
      expect(bucket.percentage).toBeLessThanOrEqual(100);
    }
  });

  it("overall score equals sum of weighted scores", () => {
    const result = scoreAssessment(makeInputs());
    const summed = result.factors.reduce((s, f) => s + f.weightedScore, 0);
    expect(result.overallScore).toBe(summed);
  });

  it("uses investigate when show stoppers are provided", () => {
    const result = scoreAssessment(
      makeInputs({
        decisionGates: {
          showStopperNotes: "Legal blocker",
        },
      }),
    );
    expect(result.gateBand).toBe("Investigate");
    expect(result.band).toBe("Investigate");
  });
});
