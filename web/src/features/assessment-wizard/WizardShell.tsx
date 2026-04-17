"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useWizard } from "./WizardContext";
import { ProgressBar } from "./ProgressBar";
import { ProjectDetailsStep } from "./steps/ProjectDetailsStep";
import { StrategicValueStep } from "./steps/StrategicValueStep";
import { DeliveryConstraintsStep } from "./steps/DeliveryConstraintsStep";
import { EconomicsAndRiskStep } from "./steps/EconomicsAndRiskStep";
import { DecisionGatesStep } from "./steps/DecisionGatesStep";
import { ReviewStep } from "./steps/ReviewStep";

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  "project-details": ProjectDetailsStep,
  "strategic-value": StrategicValueStep,
  "delivery-constraints": DeliveryConstraintsStep,
  "economics-and-risk": EconomicsAndRiskStep,
  "decision-gates": DecisionGatesStep,
  review: ReviewStep,
};

export function WizardShell() {
  const router = useRouter();
  const posthog = usePostHog();
  const {
    inputs,
    currentStep,
    isFirstStep,
    isLastStep,
    goNext,
    goBack,
  } = useWizard();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const StepComponent = STEP_COMPONENTS[currentStep];

  const canProceed =
    currentStep !== "project-details" || inputs.projectName.trim().length > 0;

  useEffect(() => {
    if (!posthog) return;

    posthog.capture("assessment_step_viewed", {
      step: currentStep,
      canProceed,
      isFirstStep,
      isLastStep,
    });
  }, [posthog, currentStep, canProceed, isFirstStep, isLastStep]);

  function handleContinue() {
    if (!canProceed) return;

    posthog?.capture("assessment_continue_clicked", { step: currentStep });
    goNext();
  }

  async function handleSubmit() {
    posthog?.capture("assessment_submission_started", { step: currentStep });
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw new Error(`Assessment failed (${response.status})`);
      }

      const result = await response.json();
      sessionStorage.setItem("buyVsBuild_result", JSON.stringify(result));
      posthog?.capture("assessment_submission_succeeded");
      router.push("/results");
    } catch (err) {
      posthog?.capture("assessment_submission_failed", {
        message: err instanceof Error ? err.message : "Unknown error",
      });
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <ProgressBar />

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (!isFirstStep) goBack();
          }}
          className="govuk-back-link"
          style={{ visibility: isFirstStep ? "hidden" : "visible" }}
        >
          Back
        </a>

        {StepComponent && <StepComponent />}

        {error && (
          <div
            className="govuk-error-summary"
            aria-labelledby="error-summary-title"
            role="alert"
            data-module="govuk-error-summary"
          >
            <h2 className="govuk-error-summary__title" id="error-summary-title">
              There is a problem
            </h2>
            <div className="govuk-error-summary__body">
              <p className="govuk-body">{error}</p>
            </div>
          </div>
        )}

        <div className="govuk-button-group govuk-!-margin-top-6">
          {isLastStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="govuk-button"
              data-module="govuk-button"
              aria-disabled={submitting}
            >
              {submitting ? "Submitting\u2026" : "Get recommendation"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canProceed}
              className="govuk-button"
              data-module="govuk-button"
              aria-disabled={!canProceed}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
