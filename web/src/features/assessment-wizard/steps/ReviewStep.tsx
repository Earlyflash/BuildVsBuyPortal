"use client";

import { SCORING_CRITERIA } from "@/domain/scoringConfig";
import type { AssessmentInputs } from "@/domain/assessment";
import { useWizard } from "../WizardContext";

function scoreLookup(inputs: AssessmentInputs, key: string): number {
  for (const bucket of [
    "strategicValue",
    "deliveryConstraints",
    "economicsAndRisk",
  ] as const) {
    const group = inputs[bucket] as unknown as Record<string, number>;
    if (key in group) return group[key];
  }
  return 0;
}

const BUCKET_LABELS: Record<string, string> = {
  strategicValue: "Strategic value",
  deliveryConstraints: "Delivery constraints",
  economicsAndRisk: "Economics and risk",
};

export function ReviewStep() {
  const { inputs } = useWizard();

  const grouped = SCORING_CRITERIA.reduce(
    (acc, c) => {
      (acc[c.bucket] ??= []).push(c);
      return acc;
    },
    {} as Record<string, typeof SCORING_CRITERIA>,
  );

  return (
    <>
      <h1 className="govuk-heading-l">Check your answers</h1>
      <p className="govuk-body">
        Review your assessment before submitting.
      </p>

      <h2 className="govuk-heading-m">Project</h2>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Name</dt>
          <dd className="govuk-summary-list__value">
            {inputs.projectName || "(Not provided)"}
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Description</dt>
          <dd className="govuk-summary-list__value">
            {inputs.projectDescription || "(Not provided)"}
          </dd>
        </div>
      </dl>

      {Object.entries(grouped).map(([bucket, criteria]) => (
        <div key={bucket}>
          <h2 className="govuk-heading-m">{BUCKET_LABELS[bucket]}</h2>
          <dl className="govuk-summary-list">
            {criteria.map((c) => (
              <div className="govuk-summary-list__row" key={c.key}>
                <dt className="govuk-summary-list__key">{c.label}</dt>
                <dd className="govuk-summary-list__value">
                  {scoreLookup(inputs, c.key)} out of 5
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      <h2 className="govuk-heading-m">Decision gates</h2>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Strategic differentiation</dt>
          <dd className="govuk-summary-list__value">
            {inputs.decisionGates.strategicDifferentiation ? "Yes" : "No"}
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Data privacy top priority</dt>
          <dd className="govuk-summary-list__value">
            {inputs.decisionGates.dataPrivacyTopPriority ? "Yes" : "No"}
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Enough talent and budget</dt>
          <dd className="govuk-summary-list__value">
            {inputs.decisionGates.enoughTalentAndBudget ? "Yes" : "No"}
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">
            Heavy customisation and control
          </dt>
          <dd className="govuk-summary-list__value">
            {inputs.decisionGates.heavyCustomizationAndControl ? "Yes" : "No"}
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Urgent time to market</dt>
          <dd className="govuk-summary-list__value">
            {inputs.decisionGates.urgentTimeToMarket ? "Yes" : "No"}
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Accept innovation risk</dt>
          <dd className="govuk-summary-list__value">
            {inputs.decisionGates.acceptInnovationRisk ? "Yes" : "No"}
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Show stoppers</dt>
          <dd className="govuk-summary-list__value">
            {inputs.decisionGates.showStopperNotes.trim() || "(None)"}
          </dd>
        </div>
      </dl>
    </>
  );
}
