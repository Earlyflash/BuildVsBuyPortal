import { NextResponse, type NextRequest } from "next/server";
import type { AssessmentInputs } from "@/domain/assessment";
import type { Recommendation } from "@/domain/recommendation";
import { scoreAssessment } from "@/server/scoringEngine";
import { generateRationale } from "@/server/rationaleService";

function normalizeInputs(raw: Partial<AssessmentInputs>): AssessmentInputs {
  return {
    projectName: raw.projectName ?? "",
    projectDescription: raw.projectDescription ?? "",
    strategicValue: {
      competitiveDifferentiation: raw.strategicValue?.competitiveDifferentiation ?? 3,
      capabilityBuilding: raw.strategicValue?.capabilityBuilding ?? 3,
      uniqueBusinessProcess: raw.strategicValue?.uniqueBusinessProcess ?? 3,
    },
    deliveryConstraints: {
      timeToMarketUrgency: raw.deliveryConstraints?.timeToMarketUrgency ?? 3,
      complianceRequirements: raw.deliveryConstraints?.complianceRequirements ?? 3,
      securitySensitivity: raw.deliveryConstraints?.securitySensitivity ?? 3,
    },
    economicsAndRisk: {
      totalCostHorizon: raw.economicsAndRisk?.totalCostHorizon ?? 3,
      integrationComplexity: raw.economicsAndRisk?.integrationComplexity ?? 3,
      vendorLockInTolerance: raw.economicsAndRisk?.vendorLockInTolerance ?? 3,
      internalCapability: raw.economicsAndRisk?.internalCapability ?? 3,
    },
    decisionGates: {
      strategicDifferentiation:
        raw.decisionGates?.strategicDifferentiation ?? false,
      dataPrivacyTopPriority: raw.decisionGates?.dataPrivacyTopPriority ?? false,
      enoughTalentAndBudget: raw.decisionGates?.enoughTalentAndBudget ?? true,
      heavyCustomizationAndControl:
        raw.decisionGates?.heavyCustomizationAndControl ?? false,
      urgentTimeToMarket: raw.decisionGates?.urgentTimeToMarket ?? true,
      acceptInnovationRisk: raw.decisionGates?.acceptInnovationRisk ?? true,
      showStopperNotes: raw.decisionGates?.showStopperNotes ?? "",
    },
  };
}

export async function POST(request: NextRequest) {
  let parsed: Partial<AssessmentInputs>;

  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const inputs = normalizeInputs(parsed);

  if (!inputs.projectName.trim()) {
    return NextResponse.json(
      { error: "projectName is required" },
      { status: 422 },
    );
  }

  const scoring = scoreAssessment(inputs);

  const rationale = await generateRationale({
    projectName: inputs.projectName,
    projectDescription: inputs.projectDescription,
    scoring,
  });

  const recommendation: Recommendation = {
    scoring,
    rationale: rationale.text,
    rationalePrompt: rationale.prompt,
    rationaleSource: rationale.source,
    rationaleStatus: rationale.status,
    rationaleError: rationale.error,
    generatedAt: new Date().toISOString(),
    projectName: inputs.projectName,
  };

  return NextResponse.json(recommendation);
}
