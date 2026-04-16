"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type {
  Recommendation,
  RecommendationBand,
} from "@/domain/recommendation";

const BAND_COLOURS: Record<RecommendationBand, string> = {
  Buy: "govuk-tag--blue",
  Investigate: "govuk-tag--yellow",
  Build: "govuk-tag--green",
};

const BAND_DESCRIPTIONS: Record<RecommendationBand, string> = {
  Buy: "The assessment suggests buying an off-the-shelf solution is likely the best approach for this project.",
  Investigate:
    "The assessment is inconclusive. Further investigation is recommended before committing to buying or building.",
  Build:
    "The assessment suggests building a custom solution is likely the best approach for this project.",
};

type MatrixPole = "Buy" | "Build";

function toMatrixPole(
  primary: RecommendationBand,
  fallback: RecommendationBand,
  percentage: number,
): MatrixPole {
  if (primary === "Buy" || primary === "Build") return primary;
  if (fallback === "Buy" || fallback === "Build") return fallback;
  return percentage >= 50 ? "Build" : "Buy";
}

function RecommendationMatrix({
  gateBand,
  weightedBand,
  percentage,
}: {
  gateBand: RecommendationBand;
  weightedBand: RecommendationBand;
  percentage: number;
}) {
  const gatePole = toMatrixPole(gateBand, weightedBand, percentage);
  const scorePole = toMatrixPole(weightedBand, gateBand, percentage);
  const activeCell = `${gatePole}-${scorePole}`;

  const cells: Array<{
    key: string;
    gate: MatrixPole;
    score: MatrixPole;
    label: string;
  }> = [
    {
      key: "Build-Buy",
      gate: "Build",
      score: "Buy",
      label: "Investigate",
    },
    {
      key: "Build-Build",
      gate: "Build",
      score: "Build",
      label: "Build",
    },
    {
      key: "Buy-Buy",
      gate: "Buy",
      score: "Buy",
      label: "Buy",
    },
    {
      key: "Buy-Build",
      gate: "Buy",
      score: "Build",
      label: "Investigate",
    },
  ];

  return (
    <div className="govuk-!-margin-bottom-6">
      <h2 className="govuk-heading-m">Gate vs score recommendation matrix</h2>
      <div className="app-matrix-wrap">
        <div className="app-matrix-content">
          <div className="app-matrix-grid-wrap">
            <div className="app-matrix-axis app-matrix-axis--y">
              <span className="app-matrix-axis--y-text">Gate recommendation</span>
            </div>
            <div className="app-matrix-row-labels" aria-hidden="true">
              <div className="app-matrix-row-label">Build</div>
              <div className="app-matrix-row-label">Buy</div>
            </div>
            <div
              className="app-matrix-grid"
              role="img"
              aria-label={`Active matrix cell: ${activeCell}`}
            >
              {cells.map((cell) => {
                const isActive = cell.key === activeCell;
                return (
                  <div
                    key={cell.key}
                    className={`app-matrix-cell${isActive ? " app-matrix-cell--active" : ""}`}
                  >
                    <div className="govuk-body-s govuk-!-margin-bottom-0">
                      <strong>{cell.label}</strong>
                      {isActive ? " (Selected for this assessment)" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="app-matrix-x-labels" aria-hidden="true">
            <div className="app-matrix-x-label">Buy</div>
            <div className="app-matrix-x-label">Build</div>
          </div>
          <div className="app-matrix-axis app-matrix-axis--x">
            Score recommendation
          </div>
        </div>
      </div>
    </div>
  );
}

function SpectrumBar({ percentage }: { percentage: number }) {
  return (
    <div className="govuk-!-margin-bottom-6">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <span className="govuk-body-s govuk-!-margin-bottom-0">Buy</span>
        <span className="govuk-body-s govuk-!-margin-bottom-0">
          Investigate
        </span>
        <span className="govuk-body-s govuk-!-margin-bottom-0">Build</span>
      </div>
      <div className="app-spectrum-bar">
        <div
          className="app-spectrum-bar__indicator"
          style={{ left: `${Math.min(Math.max(percentage, 2), 98)}%` }}
          role="img"
          aria-label={`Score indicator at ${percentage}%`}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "4px",
        }}
      >
        <span className="govuk-body-s govuk-!-font-tabular-numbers govuk-!-margin-bottom-0">
          0%
        </span>
        <span className="govuk-body-s govuk-!-font-tabular-numbers govuk-!-margin-bottom-0">
          40%
        </span>
        <span className="govuk-body-s govuk-!-font-tabular-numbers govuk-!-margin-bottom-0">
          60%
        </span>
        <span className="govuk-body-s govuk-!-font-tabular-numbers govuk-!-margin-bottom-0">
          100%
        </span>
      </div>
    </div>
  );
}

function NarrativeMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h3 className="govuk-heading-m">{children}</h3>,
        h2: ({ children }) => <h3 className="govuk-heading-m">{children}</h3>,
        h3: ({ children }) => <h3 className="govuk-heading-s">{children}</h3>,
        p: ({ children }) => <p className="govuk-body">{children}</p>,
        ul: ({ children }) => (
          <ul className="govuk-list govuk-list--bullet">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="govuk-list govuk-list--number">{children}</ol>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function exportAsMarkdown(rec: Recommendation): string {
  const {
    scoring,
    rationale,
    rationalePrompt,
    rationaleSource,
    rationaleStatus,
    rationaleError,
    projectName,
    generatedAt,
  } = rec;
  let md = `# Buy vs Build Assessment: ${projectName}\n`;
  md += `Generated: ${new Date(generatedAt).toLocaleDateString("en-GB")}\n\n`;
  md += `## Recommendation: ${scoring.band}\n`;
  md += `Overall score: ${scoring.percentage}% (${scoring.overallScore}/${scoring.maxPossibleScore})\n\n`;
  md += `Weighted-score band: ${scoring.weightedBand}\n`;
  md += `Decision-gate band: ${scoring.gateBand}\n`;
  md += `Decision-gate explanation: ${scoring.gateExplanation}\n\n`;

  md += `## Bucket scores\n`;
  for (const b of scoring.buckets) {
    md += `- **${b.label}**: ${b.percentage}% (${b.totalWeightedScore}/${b.maxPossibleScore})\n`;
  }

  md += `\n## Top drivers\n`;
  for (const d of scoring.topDrivers) {
    md += `- ${d.label}: ${d.rawScore}/5 (weight ${d.weight})\n`;
  }

  md += `\n## Narrative rationale (${rationaleSource})\n`;
  md += `${rationale}\n`;
  if (rationaleStatus === "fallback" && rationaleError) {
    md += `\nFallback reason: ${rationaleError}\n`;
  }

  md += `\n## Prompt used for narrative generation\n`;
  md += `${rationalePrompt}\n`;

  return md;
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<Recommendation | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("buyVsBuild_result");
      if (stored) {
        setResult(JSON.parse(stored));
      }
    } catch {
      // corrupt data
    }
  }, []);

  if (!result) {
    return (
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">No results found</h1>
          <p className="govuk-body">
            You have not completed an assessment yet.
          </p>
          <a
            href="/assess"
            role="button"
            draggable="false"
            className="govuk-button"
            data-module="govuk-button"
          >
            Start an assessment
          </a>
        </div>
      </div>
    );
  }

  const {
    scoring,
    rationale,
    rationalePrompt,
    rationaleSource,
    rationaleStatus,
    rationaleError,
    projectName,
  } = result;
  const bandColour = BAND_COLOURS[scoring.band];

  function handleExport() {
    if (!result) return;
    const md = exportAsMarkdown(result);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}-assessment.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <div className="govuk-panel govuk-panel--confirmation">
          <h1 className="govuk-panel__title">Assessment complete</h1>
          <div className="govuk-panel__body">
            Recommendation:{" "}
            <strong>{scoring.band}</strong>
            <br />
            Score: {scoring.percentage}%
          </div>
        </div>

        <h2 className="govuk-heading-m">{projectName}</h2>

        <p className="govuk-body">{BAND_DESCRIPTIONS[scoring.band]}</p>

        <p className="govuk-body">
          <strong className={`govuk-tag ${bandColour}`}>
            {scoring.band}
          </strong>{" "}
          <span className="govuk-!-font-tabular-numbers">
            {scoring.percentage}% ({scoring.overallScore} /{" "}
            {scoring.maxPossibleScore})
          </span>
        </p>

        <h2 className="govuk-heading-m">Decision-gate outcome</h2>
        <p className="govuk-body">
          <strong>Gate recommendation:</strong> {scoring.gateBand}
          <br />
          <strong>Score recommendation:</strong> {scoring.weightedBand}
          <br />
          <strong>Final recommendation:</strong> {scoring.band}
        </p>
        <p className="govuk-body">{scoring.gateExplanation}</p>
        <ul className="govuk-list govuk-list--bullet">
          {scoring.gateSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>

        <div className="app-result-section app-result-section--matrix">
          <RecommendationMatrix
            gateBand={scoring.gateBand}
            weightedBand={scoring.weightedBand}
            percentage={scoring.percentage}
          />
        </div>

        <div className="app-result-section app-result-section--spectrum">
          <h2 className="govuk-heading-m">Score spectrum</h2>
          <p className="govuk-body-s">
            This shows where your weighted score sits on the buy-to-build range.
          </p>
          <SpectrumBar percentage={scoring.percentage} />
        </div>

        <h2 className="govuk-heading-m">Bucket breakdown</h2>

        <div className="govuk-grid-row">
          {scoring.buckets.map((bucket) => (
            <div className="govuk-grid-column-one-third" key={bucket.bucket}>
              <div className="app-score-block">
                <p className="govuk-body-s govuk-!-font-weight-bold govuk-!-margin-bottom-1">
                  {bucket.label}
                </p>
                <div className="app-score-block__bar">
                  <div
                    className="app-score-block__bar-fill"
                    style={{ width: `${bucket.percentage}%` }}
                  />
                </div>
                <p className="govuk-body-s govuk-!-font-tabular-numbers govuk-!-margin-bottom-0">
                  {bucket.percentage}% ({bucket.totalWeightedScore}/
                  {bucket.maxPossibleScore})
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="govuk-heading-m">Top drivers</h2>

        <dl className="govuk-summary-list">
          {scoring.topDrivers.map((driver) => (
            <div className="govuk-summary-list__row" key={driver.key}>
              <dt className="govuk-summary-list__key">{driver.label}</dt>
              <dd className="govuk-summary-list__value">
                <div className="app-driver-pips">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={`app-driver-pip ${n <= driver.rawScore ? "app-driver-pip--filled" : ""}`}
                    />
                  ))}
                  <span className="govuk-body-s govuk-!-font-tabular-numbers govuk-!-margin-bottom-0 govuk-!-margin-left-1">
                    {driver.rawScore}/5
                  </span>
                </div>
              </dd>
              <dd className="govuk-summary-list__actions">
                <span className="govuk-body-s govuk-!-margin-bottom-0">
                  Weight: {driver.weight}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <details className="govuk-details">
          <summary className="govuk-details__summary">
            <span className="govuk-details__summary-text">
              View all factors
            </span>
          </summary>
          <div className="govuk-details__text">
            <table className="govuk-table">
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th scope="col" className="govuk-table__header">
                    Factor
                  </th>
                  <th
                    scope="col"
                    className="govuk-table__header govuk-table__header--numeric"
                  >
                    Score
                  </th>
                  <th
                    scope="col"
                    className="govuk-table__header govuk-table__header--numeric"
                  >
                    Weight
                  </th>
                  <th
                    scope="col"
                    className="govuk-table__header govuk-table__header--numeric"
                  >
                    Weighted
                  </th>
                </tr>
              </thead>
              <tbody className="govuk-table__body">
                {scoring.factors.map((f) => (
                  <tr className="govuk-table__row" key={f.key}>
                    <td className="govuk-table__cell">{f.label}</td>
                    <td className="govuk-table__cell govuk-table__cell--numeric">
                      {f.rawScore}
                    </td>
                    <td className="govuk-table__cell govuk-table__cell--numeric">
                      {f.weight}
                    </td>
                    <td className="govuk-table__cell govuk-table__cell--numeric">
                      {f.weightedScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <h2 className="govuk-heading-m">Narrative rationale</h2>
        {rationaleStatus === "fallback" && (
          <div className="govuk-warning-text">
            <span className="govuk-warning-text__icon" aria-hidden="true">
              !
            </span>
            <strong className="govuk-warning-text__text">
              <span className="govuk-warning-text__assistive">Warning</span>
              Gemini response unavailable; showing fallback narrative.
              {rationaleError ? ` (${rationaleError})` : ""}
            </strong>
          </div>
        )}
        {rationaleStatus === "ok" && rationaleSource === "gemini" && (
          <p className="govuk-body-s">Generated by Gemini.</p>
        )}
        <div className="govuk-inset-text app-rationale-markdown">
          <NarrativeMarkdown content={rationale} />
        </div>
        <p className="govuk-body-s">
          Review this narrative alongside the quantitative outputs before making
          a final decision.
        </p>

        <details className="govuk-details" data-module="govuk-details">
          <summary className="govuk-details__summary">
            <span className="govuk-details__summary-text">
              Show AI prompt
            </span>
          </summary>
          <div className="govuk-details__text">
            <p className="govuk-body-s">
              This is the exact prompt sent to the narrative generator.
            </p>
            <div
              className="govuk-inset-text"
              style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}
            >
              {rationalePrompt}
            </div>
          </div>
        </details>

        <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

        <div className="govuk-button-group">
          <button
            type="button"
            className="govuk-button govuk-button--secondary"
            data-module="govuk-button"
            onClick={handleExport}
          >
            Export as Markdown
          </button>
          <a href="/assess" className="govuk-link">
            Start a new assessment
          </a>
        </div>
      </div>
    </div>
  );
}
