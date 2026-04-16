import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buy vs Build Assessment – Ministry of Justice",
  description:
    "Guided assessment to determine whether your project should buy an off-the-shelf solution or build a custom one.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="govuk-template">
      <head>
        <link
          rel="stylesheet"
          href="/assets/govuk-frontend.min.css"
        />
      </head>
      <body className="govuk-template__body js-enabled">
        <a href="#main-content" className="govuk-skip-link">
          Skip to main content
        </a>

        <header className="govuk-header" role="banner" data-module="govuk-header">
          <div className="govuk-header__container govuk-width-container">
            <div className="govuk-header__content">
              <a
                href="/"
                className="govuk-header__link govuk-header__service-name"
              >
                Buy vs Build Assessment
              </a>
            </div>
          </div>
        </header>

        <div className="govuk-width-container">
          <div className="app-phase-banner govuk-phase-banner">
            <p className="govuk-phase-banner__content">
              <strong className="govuk-tag govuk-phase-banner__content__tag">
                Beta
              </strong>
              <span className="govuk-phase-banner__text">
                This is a new service &ndash; your{" "}
                <a className="govuk-link" href="#">
                  feedback
                </a>{" "}
                will help us to improve it.
              </span>
            </p>
          </div>

          <main className="govuk-main-wrapper" id="main-content" role="main">
            {children}
          </main>
        </div>

        <footer className="govuk-footer" role="contentinfo">
          <div className="govuk-width-container">
            <div className="govuk-footer__meta">
              <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
                <span className="govuk-footer__licence-description">
                  All content is available under the{" "}
                  <a
                    className="govuk-footer__link"
                    href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                    rel="license"
                  >
                    Open Government Licence v3.0
                  </a>
                  , except where otherwise stated
                </span>
              </div>
              <div className="govuk-footer__meta-item">
                <a
                  className="govuk-footer__link govuk-footer__copyright-logo"
                  href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
                >
                  © Crown copyright
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
