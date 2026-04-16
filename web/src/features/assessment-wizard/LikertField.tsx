"use client";

import type { LikertScore } from "@/domain/assessment";

interface LikertFieldProps {
  id: string;
  label: string;
  description: string;
  value: LikertScore;
  lowLabel?: string;
  highLabel?: string;
  onChange: (value: LikertScore) => void;
}

const SCORES: LikertScore[] = [1, 2, 3, 4, 5];

export function LikertField({
  id,
  label,
  description,
  value,
  lowLabel = "Low",
  highLabel = "High",
  onChange,
}: LikertFieldProps) {
  return (
    <div className="govuk-form-group">
      <fieldset className="govuk-fieldset">
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
          {label}
        </legend>
        <div id={`${id}-hint`} className="govuk-hint">
          {description}
        </div>
        <div className="govuk-radios govuk-radios--inline" data-module="govuk-radios">
          <p className="govuk-body-s govuk-!-margin-bottom-1">{lowLabel}</p>
          {SCORES.map((score) => (
            <div className="govuk-radios__item" key={score}>
              <input
                className="govuk-radios__input"
                id={`${id}-${score}`}
                name={id}
                type="radio"
                value={score}
                checked={value === score}
                onChange={() => onChange(score)}
                aria-describedby={`${id}-hint`}
              />
              <label
                className="govuk-label govuk-radios__label"
                htmlFor={`${id}-${score}`}
              >
                {score}
              </label>
            </div>
          ))}
          <p className="govuk-body-s govuk-!-margin-bottom-1">{highLabel}</p>
        </div>
      </fieldset>
    </div>
  );
}
