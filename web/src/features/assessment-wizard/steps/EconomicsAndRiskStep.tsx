"use client";

import type {
  LikertScore,
  EconomicsAndRiskInputs,
} from "@/domain/assessment";
import { SCORING_CRITERIA } from "@/domain/scoringConfig";
import { useWizard } from "../WizardContext";
import { LikertField } from "../LikertField";

const CRITERIA = SCORING_CRITERIA.filter(
  (c) => c.bucket === "economicsAndRisk",
);

export function EconomicsAndRiskStep() {
  const { inputs, setNestedInputs } = useWizard();

  return (
    <>
      <h1 className="govuk-heading-l">Economics and risk</h1>
      <p className="govuk-body">
        What are the cost, integration and capability considerations? Rate each
        factor from 1 (low) to 5 (high).
      </p>
      {CRITERIA.map((criterion) => (
        <LikertField
          key={criterion.key}
          id={criterion.key}
          label={criterion.label}
          description={criterion.description}
          value={
            inputs.economicsAndRisk[
              criterion.key as keyof EconomicsAndRiskInputs
            ]
          }
          onChange={(val: LikertScore) =>
            setNestedInputs("economicsAndRisk", {
              [criterion.key]: val,
            } as Partial<EconomicsAndRiskInputs>)
          }
        />
      ))}
    </>
  );
}
