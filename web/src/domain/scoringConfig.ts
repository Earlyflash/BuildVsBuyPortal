export interface CriterionWeight {
  key: string;
  label: string;
  description: string;
  weight: number;
  bucket: "strategicValue" | "deliveryConstraints" | "economicsAndRisk";
}

export const SCORING_CRITERIA: CriterionWeight[] = [
  {
    key: "competitiveDifferentiation",
    label: "Competitive Differentiation",
    description:
      "How much does this capability set the organisation apart from others?",
    weight: 15,
    bucket: "strategicValue",
  },
  {
    key: "capabilityBuilding",
    label: "Capability Building",
    description:
      "Will building this develop lasting internal skills and knowledge?",
    weight: 10,
    bucket: "strategicValue",
  },
  {
    key: "uniqueBusinessProcess",
    label: "Unique Business Process",
    description:
      "Does this support a process unique to the organisation that off-the-shelf products cannot replicate?",
    weight: 12,
    bucket: "strategicValue",
  },
  {
    key: "timeToMarketUrgency",
    label: "Time-to-Market Urgency",
    description:
      "How urgent is the delivery deadline? Higher urgency favours buying.",
    weight: 10,
    bucket: "deliveryConstraints",
  },
  {
    key: "complianceRequirements",
    label: "Compliance Requirements",
    description:
      "Are there strict regulatory or compliance constraints that a vendor may not satisfy?",
    weight: 10,
    bucket: "deliveryConstraints",
  },
  {
    key: "securitySensitivity",
    label: "Security Sensitivity",
    description:
      "How sensitive is the data or process? Higher sensitivity may favour building for control.",
    weight: 8,
    bucket: "deliveryConstraints",
  },
  {
    key: "totalCostHorizon",
    label: "Total Cost of Ownership",
    description:
      "Over a 5-year horizon, is building likely to be more cost-effective than licensing?",
    weight: 12,
    bucket: "economicsAndRisk",
  },
  {
    key: "integrationComplexity",
    label: "Integration Complexity",
    description:
      "How many existing systems must this integrate with? Higher complexity may favour building for flexibility.",
    weight: 8,
    bucket: "economicsAndRisk",
  },
  {
    key: "vendorLockInTolerance",
    label: "Vendor Lock-in Tolerance",
    description:
      "How acceptable is dependency on a single vendor? Lower tolerance favours building.",
    weight: 8,
    bucket: "economicsAndRisk",
  },
  {
    key: "internalCapability",
    label: "Internal Capability",
    description:
      "Does the team have the skills and capacity to build and maintain this?",
    weight: 7,
    bucket: "economicsAndRisk",
  },
];

export const TOTAL_WEIGHT = SCORING_CRITERIA.reduce(
  (sum, c) => sum + c.weight,
  0,
);

export const THRESHOLDS = {
  buyMax: 40,
  investigateMax: 59,
} as const;
