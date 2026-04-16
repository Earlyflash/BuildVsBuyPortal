"use client";

import { useWizard } from "../WizardContext";

export function ProjectDetailsStep() {
  const { inputs, setInputs } = useWizard();

  return (
    <>
      <h1 className="govuk-heading-l">Project details</h1>
      <p className="govuk-body">
        Provide a name and brief description of the project you are evaluating.
      </p>

      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="projectName">
          Project name
        </label>
        <input
          className="govuk-input"
          id="projectName"
          name="projectName"
          type="text"
          value={inputs.projectName}
          onChange={(e) => setInputs({ projectName: e.target.value })}
          autoComplete="off"
        />
      </div>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="projectDescription"
        >
          Project description
        </label>
        <div id="projectDescription-hint" className="govuk-hint">
          Briefly describe what this project needs to deliver and the problem it
          solves.
        </div>
        <textarea
          className="govuk-textarea"
          id="projectDescription"
          name="projectDescription"
          rows={5}
          aria-describedby="projectDescription-hint"
          value={inputs.projectDescription}
          onChange={(e) =>
            setInputs({ projectDescription: e.target.value })
          }
        />
      </div>

      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset" aria-describedby="llmOptIn-hint">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
            AI narrative consent
          </legend>
          <div id="llmOptIn-hint" className="govuk-hint">
            If selected, your project details are redacted and then sent to
            Gemini to generate a narrative summary. Leave unticked to use a
            deterministic local summary only.
          </div>
          <div className="govuk-checkboxes" data-module="govuk-checkboxes">
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="llmOptIn"
                name="llmOptIn"
                type="checkbox"
                checked={inputs.llmOptIn}
                onChange={(e) => setInputs({ llmOptIn: e.target.checked })}
              />
              <label className="govuk-label govuk-checkboxes__label" htmlFor="llmOptIn">
                I consent to optional AI narrative generation for this assessment.
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
}
