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
    </>
  );
}
