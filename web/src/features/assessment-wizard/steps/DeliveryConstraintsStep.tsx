"use client";

import type {
  LikertScore,
  DeliveryConstraintInputs,
} from "@/domain/assessment";
import { SCORING_CRITERIA } from "@/domain/scoringConfig";
import { useWizard } from "../WizardContext";
import { LikertField } from "../LikertField";

const CRITERIA = SCORING_CRITERIA.filter(
  (c) => c.bucket === "deliveryConstraints",
);

export function DeliveryConstraintsStep() {
  const { inputs, setNestedInputs } = useWizard();

  return (
    <>
      <h1 className="govuk-heading-l">Delivery constraints</h1>
      <p className="govuk-body">
        What timeline, compliance and security pressures exist? Rate each factor
        from 1 (low) to 5 (high).
      </p>
      {CRITERIA.map((criterion) => (
        <LikertField
          key={criterion.key}
          id={criterion.key}
          label={criterion.label}
          description={criterion.description}
          value={
            inputs.deliveryConstraints[
              criterion.key as keyof DeliveryConstraintInputs
            ]
          }
          onChange={(val: LikertScore) =>
            setNestedInputs("deliveryConstraints", {
              [criterion.key]: val,
            } as Partial<DeliveryConstraintInputs>)
          }
        />
      ))}
    </>
  );
}
