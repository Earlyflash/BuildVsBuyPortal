import type { AssessmentInputs } from "@/domain/assessment";
import type {
  ScoringResult,
  FactorContribution,
  BucketSummary,
  RecommendationBand,
} from "@/domain/recommendation";
import { SCORING_CRITERIA, TOTAL_WEIGHT, THRESHOLDS } from "@/domain/scoringConfig";

const BUCKET_LABELS: Record<string, string> = {
  strategicValue: "Strategic Value",
  deliveryConstraints: "Delivery Constraints",
  economicsAndRisk: "Economics & Risk",
};

function lookupRawScore(inputs: AssessmentInputs, key: string): number {
  for (const bucket of [
    "strategicValue",
    "deliveryConstraints",
    "economicsAndRisk",
  ] as const) {
    const group = inputs[bucket] as unknown as Record<string, number>;
    if (key in group) return group[key];
  }
  return 3;
}

function determineBand(percentage: number): RecommendationBand {
  if (percentage <= THRESHOLDS.buyMax) return "Buy";
  if (percentage <= THRESHOLDS.investigateMax) return "Investigate";
  return "Build";
}

function evaluateGates(inputs: AssessmentInputs): {
  gateBand: RecommendationBand;
  signals: string[];
  explanation: string;
  hasShowStopper: boolean;
} {
  const gates = inputs.decisionGates;
  const signals: string[] = [];

  if (gates.strategicDifferentiation) {
    signals.push("Strategic differentiation is present.");
  } else {
    signals.push("Limited strategic differentiation.");
  }

  if (gates.dataPrivacyTopPriority) {
    signals.push("Data privacy/control is a top priority.");
  }

  if (!gates.enoughTalentAndBudget) {
    signals.push("Insufficient talent or budget for full custom build.");
  } else {
    signals.push("Sufficient talent and budget available.");
  }

  if (gates.heavyCustomizationAndControl) {
    signals.push("Heavy customisation/control is required.");
  }

  if (gates.urgentTimeToMarket) {
    signals.push("Time-to-market is urgent.");
  }

  if (!gates.acceptInnovationRisk) {
    signals.push("Low tolerance for innovation/delivery risk.");
  } else {
    signals.push("Organisation accepts innovation risk.");
  }

  const showStopper = gates.showStopperNotes.trim().length > 0;
  if (showStopper) {
    return {
      gateBand: "Investigate",
      signals: [
        ...signals,
        "Explicit show stopper(s) were provided and require resolution.",
      ],
      explanation:
        "Show stoppers are present, so the decision should pause at Investigate until blockers are resolved.",
      hasShowStopper: true,
    };
  }

  let buildPoints = 0;
  let buyPoints = 0;

  if (gates.strategicDifferentiation) buildPoints += 2;
  else buyPoints += 1;

  if (gates.dataPrivacyTopPriority) buildPoints += 2;
  else buyPoints += 1;

  if (gates.enoughTalentAndBudget) buildPoints += 2;
  else buyPoints += 2;

  if (gates.heavyCustomizationAndControl) buildPoints += 2;
  else buyPoints += 1;

  if (gates.urgentTimeToMarket) buyPoints += 2;
  else buildPoints += 1;

  if (gates.acceptInnovationRisk) buyPoints += 2;
  else buildPoints += 1;

  const delta = buildPoints - buyPoints;
  if (delta >= 3) {
    return {
      gateBand: "Build",
      signals,
      explanation:
        "Decision gates show stronger build signals than buy signals.",
      hasShowStopper: false,
    };
  }

  if (delta <= -3) {
    return {
      gateBand: "Buy",
      signals,
      explanation:
        "Decision gates show stronger buy signals than build signals.",
      hasShowStopper: false,
    };
  }

  return {
    gateBand: "Investigate",
    signals,
    explanation:
      "Decision gates are mixed, so additional investigation is recommended.",
    hasShowStopper: false,
  };
}

function mergeBands(
  weightedBand: RecommendationBand,
  gateBand: RecommendationBand,
  hasShowStopper: boolean,
): RecommendationBand {
  if (hasShowStopper) return "Investigate";
  if (gateBand === "Investigate") return weightedBand;
  if (weightedBand === gateBand) return weightedBand;
  if (weightedBand === "Investigate") return gateBand;
  return "Investigate";
}

export function scoreAssessment(inputs: AssessmentInputs): ScoringResult {
  const factors: FactorContribution[] = SCORING_CRITERIA.map((criterion) => {
    const rawScore = lookupRawScore(inputs, criterion.key);
    const weightedScore = rawScore * criterion.weight;
    return {
      key: criterion.key,
      label: criterion.label,
      rawScore,
      weight: criterion.weight,
      weightedScore,
      bucket: criterion.bucket,
    };
  });

  const overallScore = factors.reduce((sum, f) => sum + f.weightedScore, 0);
  const maxPossibleScore = TOTAL_WEIGHT * 5;
  const percentage = Math.round((overallScore / maxPossibleScore) * 100);
  const weightedBand = determineBand(percentage);
  const gateEvaluation = evaluateGates(inputs);
  const band = mergeBands(
    weightedBand,
    gateEvaluation.gateBand,
    gateEvaluation.hasShowStopper,
  );

  const bucketMap = new Map<string, { weighted: number; maxPossible: number }>();
  for (const factor of factors) {
    const existing = bucketMap.get(factor.bucket) ?? {
      weighted: 0,
      maxPossible: 0,
    };
    existing.weighted += factor.weightedScore;
    existing.maxPossible += factor.weight * 5;
    bucketMap.set(factor.bucket, existing);
  }

  const buckets: BucketSummary[] = Array.from(bucketMap.entries()).map(
    ([bucket, data]) => ({
      bucket,
      label: BUCKET_LABELS[bucket] ?? bucket,
      totalWeightedScore: data.weighted,
      maxPossibleScore: data.maxPossible,
      percentage: Math.round((data.weighted / data.maxPossible) * 100),
    }),
  );

  const topDrivers = [...factors]
    .sort((a, b) => b.weightedScore - a.weightedScore)
    .slice(0, 3);

  return {
    overallScore,
    maxPossibleScore,
    percentage,
    band,
    weightedBand,
    gateBand: gateEvaluation.gateBand,
    factors,
    buckets,
    topDrivers,
    gateSignals: gateEvaluation.signals,
    gateExplanation: gateEvaluation.explanation,
  };
}
