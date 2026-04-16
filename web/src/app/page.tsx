import Link from "next/link";

export default function Home() {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">Should you buy or build?</h1>
        <p className="govuk-body-l">
          Use this service to assess whether your project should purchase an
          off-the-shelf solution or build a custom one.
        </p>
        <p className="govuk-body">
          You will answer questions about your project across three areas:
        </p>
        <ol className="govuk-list govuk-list--number">
          <li>Strategic value of the capability</li>
          <li>Delivery constraints and compliance needs</li>
          <li>Economics, risk and team capability</li>
        </ol>
        <p className="govuk-body">
          At the end you will receive a recommendation on the buy-to-build
          spectrum with an explanation of the key factors.
        </p>

        <h2 className="govuk-heading-m">Before you start</h2>
        <p className="govuk-body">You will need to know:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>the strategic goals of your project</li>
          <li>any compliance or security requirements</li>
          <li>your team&apos;s capacity and skills</li>
          <li>approximate budget and timeline</li>
        </ul>

        <Link
          href="/assess"
          role="button"
          draggable="false"
          className="govuk-button govuk-button--start"
          data-module="govuk-button"
        >
          Start now
          <svg
            className="govuk-button__start-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="17.5"
            height="19"
            viewBox="0 0 33 40"
            aria-hidden="true"
            focusable="false"
          >
            <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
