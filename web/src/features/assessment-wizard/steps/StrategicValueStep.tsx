"use client";

import type { LikertScore, StrategicValueInputs } from "@/domain/assessment";
import { SCORING_CRITERIA } from "@/domain/scoringConfig";
import { useWizard } from "../WizardContext";
import { LikertField } from "../LikertField";

const CRITERIA = SCORING_CRITERIA.filter((c) => c.bucket === "strategicValue");

export function StrategicValueStep() {
  const { inputs, setNestedInputs } = useWizard();

  return (
    <>
      <h1 className="govuk-heading-l">Strategic value</h1>
      <p className="govuk-body">
        How strategically important is building this capability in-house? Rate
        each factor from 1 (low) to 5 (high).
      </p>
      {CRITERIA.map((criterion) => (
        <LikertField
          key={criterion.key}
          id={criterion.key}
          label={criterion.label}
          description={criterion.description}
          value={
            inputs.strategicValue[
              criterion.key as keyof StrategicValueInputs
            ]
          }
          onChange={(val: LikertScore) =>
            setNestedInputs("strategicValue", {
              [criterion.key]: val,
            } as Partial<StrategicValueInputs>)
          }
        />
      ))}
    </>
  );
}
