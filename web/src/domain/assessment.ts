export type LikertScore = 1 | 2 | 3 | 4 | 5;

export interface StrategicValueInputs {
  competitiveDifferentiation: LikertScore;
  capabilityBuilding: LikertScore;
  uniqueBusinessProcess: LikertScore;
}

export interface DeliveryConstraintInputs {
  timeToMarketUrgency: LikertScore;
  complianceRequirements: LikertScore;
  securitySensitivity: LikertScore;
}

export interface EconomicsAndRiskInputs {
  totalCostHorizon: LikertScore;
  integrationComplexity: LikertScore;
  vendorLockInTolerance: LikertScore;
  internalCapability: LikertScore;
}

export interface DecisionGateInputs {
  strategicDifferentiation: boolean;
  dataPrivacyTopPriority: boolean;
  enoughTalentAndBudget: boolean;
  heavyCustomizationAndControl: boolean;
  urgentTimeToMarket: boolean;
  acceptInnovationRisk: boolean;
  showStopperNotes: string;
}

export interface AssessmentInputs {
  projectName: string;
  projectDescription: string;
  strategicValue: StrategicValueInputs;
  deliveryConstraints: DeliveryConstraintInputs;
  economicsAndRisk: EconomicsAndRiskInputs;
  decisionGates: DecisionGateInputs;
}

export type WizardStep =
  | "project-details"
  | "strategic-value"
  | "delivery-constraints"
  | "economics-and-risk"
  | "decision-gates"
  | "review";

export const WIZARD_STEPS: WizardStep[] = [
  "project-details",
  "strategic-value",
  "delivery-constraints",
  "economics-and-risk",
  "decision-gates",
  "review",
];

export const STEP_LABELS: Record<WizardStep, string> = {
  "project-details": "Project Details",
  "strategic-value": "Strategic Value",
  "delivery-constraints": "Delivery Constraints",
  "economics-and-risk": "Economics & Risk",
  "decision-gates": "Decision Gates",
  review: "Review",
};
