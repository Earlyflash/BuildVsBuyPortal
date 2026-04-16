"use client";

import { WIZARD_STEPS, STEP_LABELS } from "@/domain/assessment";
import { useWizard } from "./WizardContext";

export function ProgressBar() {
  const { stepIndex } = useWizard();
  const totalSteps = WIZARD_STEPS.length;
  const currentLabel = STEP_LABELS[WIZARD_STEPS[stepIndex]];

  return (
    <div className="govuk-!-margin-bottom-6">
      <p className="govuk-body govuk-!-margin-bottom-1">
        <span className="govuk-visually-hidden">Step </span>
        <strong>
          {stepIndex + 1} of {totalSteps}
        </strong>
      </p>
      <p className="govuk-heading-s govuk-!-margin-bottom-2">{currentLabel}</p>
      <div
        style={{
          height: "8px",
          backgroundColor: "#f3f2f1",
          borderRadius: "4px",
          overflow: "hidden",
        }}
        role="progressbar"
        aria-valuenow={stepIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${stepIndex + 1} of ${totalSteps}: ${currentLabel}`}
      >
        <div
          style={{
            height: "100%",
            width: `${((stepIndex + 1) / totalSteps) * 100}%`,
            backgroundColor: "#1d70b8",
            borderRadius: "4px",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
