export type RecommendationBand = "Buy" | "Investigate" | "Build";

export interface FactorContribution {
  key: string;
  label: string;
  rawScore: number;
  weight: number;
  weightedScore: number;
  bucket: string;
}

export interface BucketSummary {
  bucket: string;
  label: string;
  totalWeightedScore: number;
  maxPossibleScore: number;
  percentage: number;
}

export interface ScoringResult {
  overallScore: number;
  maxPossibleScore: number;
  percentage: number;
  band: RecommendationBand;
  weightedBand: RecommendationBand;
  gateBand: RecommendationBand;
  factors: FactorContribution[];
  buckets: BucketSummary[];
  topDrivers: FactorContribution[];
  gateSignals: string[];
  gateExplanation: string;
}

export interface Recommendation {
  scoring: ScoringResult;
  rationale: string;
  rationalePrompt: string;
  rationaleSource: "gemini" | "fallback";
  rationaleStatus: "ok" | "fallback";
  rationaleError: string | null;
  generatedAt: string;
  projectName: string;
}
