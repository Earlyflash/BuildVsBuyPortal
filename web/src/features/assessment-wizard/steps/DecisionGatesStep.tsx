"use client";

import { useWizard } from "../WizardContext";

interface BinaryQuestionProps {
  id: string;
  label: string;
  hint: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

function BinaryQuestion({
  id,
  label,
  hint,
  value,
  onChange,
}: BinaryQuestionProps) {
  return (
    <div className="govuk-form-group">
      <fieldset className="govuk-fieldset" aria-describedby={`${id}-hint`}>
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
          {label}
        </legend>
        <div id={`${id}-hint`} className="govuk-hint">
          {hint}
        </div>
        <div className="govuk-radios govuk-radios--inline">
          <div className="govuk-radios__item">
            <input
              className="govuk-radios__input"
              id={`${id}-yes`}
              name={id}
              type="radio"
              checked={value}
              onChange={() => onChange(true)}
            />
            <label className="govuk-label govuk-radios__label" htmlFor={`${id}-yes`}>
              Yes
            </label>
          </div>
          <div className="govuk-radios__item">
            <input
              className="govuk-radios__input"
              id={`${id}-no`}
              name={id}
              type="radio"
              checked={!value}
              onChange={() => onChange(false)}
            />
            <label className="govuk-label govuk-radios__label" htmlFor={`${id}-no`}>
              No
            </label>
          </div>
        </div>
      </fieldset>
    </div>
  );
}

export function DecisionGatesStep() {
  const { inputs, setNestedInputs } = useWizard();
  const gates = inputs.decisionGates;

  return (
    <>
      <h1 className="govuk-heading-l">Decision gates</h1>
      <p className="govuk-body">
        These Gartner-inspired gates add explicit buy/build signals and
        potential blockers to the recommendation.
      </p>

      <BinaryQuestion
        id="strategicDifferentiation"
        label="Is this capability strategically differentiating for your organisation?"
        hint="If yes, building is often more attractive."
        value={gates.strategicDifferentiation}
        onChange={(value) =>
          setNestedInputs("decisionGates", { strategicDifferentiation: value })
        }
      />

      <BinaryQuestion
        id="dataPrivacyTopPriority"
        label="Is strict data privacy or data residency a top priority?"
        hint="If yes, this often favours greater control."
        value={gates.dataPrivacyTopPriority}
        onChange={(value) =>
          setNestedInputs("decisionGates", { dataPrivacyTopPriority: value })
        }
      />

      <BinaryQuestion
        id="enoughTalentAndBudget"
        label="Do you have enough talent and budget to build and maintain this?"
        hint="If no, buying is often lower risk."
        value={gates.enoughTalentAndBudget}
        onChange={(value) =>
          setNestedInputs("decisionGates", { enoughTalentAndBudget: value })
        }
      />

      <BinaryQuestion
        id="heavyCustomizationAndControl"
        label="Will this require heavy customisation and control?"
        hint="If yes, building is often more suitable."
        value={gates.heavyCustomizationAndControl}
        onChange={(value) =>
          setNestedInputs("decisionGates", {
            heavyCustomizationAndControl: value,
          })
        }
      />

      <BinaryQuestion
        id="urgentTimeToMarket"
        label="Is fast time-to-market critical?"
        hint="If yes, buying can be faster."
        value={gates.urgentTimeToMarket}
        onChange={(value) =>
          setNestedInputs("decisionGates", { urgentTimeToMarket: value })
        }
      />

      <BinaryQuestion
        id="acceptInnovationRisk"
        label="Are you comfortable with higher innovation and delivery risk?"
        hint="If no, buying may reduce risk."
        value={gates.acceptInnovationRisk}
        onChange={(value) =>
          setNestedInputs("decisionGates", { acceptInnovationRisk: value })
        }
      />

      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="showStopperNotes">
          Show stoppers (optional)
        </label>
        <div id="showStopperNotes-hint" className="govuk-hint">
          Add any blockers that could prevent a straightforward buy/build
          decision (for example legal constraints, procurement blockers, or
          unavailable skills).
        </div>
        <textarea
          id="showStopperNotes"
          className="govuk-textarea"
          rows={4}
          aria-describedby="showStopperNotes-hint"
          value={gates.showStopperNotes}
          onChange={(event) =>
            setNestedInputs("decisionGates", {
              showStopperNotes: event.target.value,
            })
          }
        />
      </div>
    </>
  );
}
