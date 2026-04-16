# Buy vs Build Portal -- MVP Technical Documentation

## Overview

The Buy vs Build Portal is a guided assessment tool for MoJ teams evaluating whether to purchase an off-the-shelf solution or build a custom one. Users answer questions across three dimensions and receive a scored recommendation with an optional AI-generated rationale.

## Architecture

```
web/
  src/
    app/              Next.js App Router pages and API routes
      api/assess/     POST endpoint -- runs scoring + optional AI rationale
      assess/         Guided wizard page
      results/        Recommendation display page
    domain/           Shared type contracts (assessment, scoring config, recommendation)
    features/
      assessment-wizard/   Wizard UI components, context, progress bar, step components
    server/           Server-only logic (scoring engine, rationale service)
```

## Decision Model

### Scoring approach

The scoring engine is deterministic and transparent. Ten criteria are grouped into three buckets:

| Bucket | Criteria | Total Weight |
|--------|----------|-------------|
| Strategic Value | Competitive Differentiation (15), Capability Building (10), Unique Business Process (12) | 37 |
| Delivery Constraints | Time-to-Market Urgency (10), Compliance Requirements (10), Security Sensitivity (8) | 28 |
| Economics & Risk | Total Cost of Ownership (12), Integration Complexity (8), Vendor Lock-in Tolerance (8), Internal Capability (7) | 35 |

Each criterion is rated 1-5 on a Likert scale.

### Band thresholds

| Percentage | Recommendation |
|-----------|---------------|
| 0-40%     | Buy           |
| 41-59%    | Investigate   |
| 60-100%   | Build         |

All weights and thresholds are defined in `web/src/domain/scoringConfig.ts` and can be recalibrated without UI changes.

### AI rationale (optional)

When a `GEMINI_API_KEY` is configured, the API route calls Gemini to generate a 3-4 paragraph narrative that interprets the scoring result. The AI output never overrides the deterministic recommendation. If the key is absent or the API call fails, the recommendation still completes without a rationale.

## Local Development

```bash
cd web
npm install
cp .env.example .env.local   # add GEMINI_API_KEY
npm run dev                   # http://localhost:3000
npm test                      # vitest
```

## Key Design Decisions

1. **GOV.UK Design System** -- all UI follows GOV.UK design principles using `govuk-frontend`. This ensures WCAG 2.2 AA compliance, consistent Crown service branding, and progressive enhancement out of the box. The pre-compiled CSS is served as a static asset; fonts and images are copied from the npm package to `public/assets/`.
2. **Single Next.js app** -- minimises deployment complexity; API routes run server-side so the Gemini key is never exposed to the browser.
3. **Configuration-driven model** -- weights and thresholds live in a single config file for easy recalibration.
4. **Local storage draft persistence** -- wizard state is saved to localStorage so users can return to an incomplete assessment.
5. **Session storage for results** -- results are kept in sessionStorage for the current tab only; no server-side data persistence in the MVP.
6. **Progressive enhancement** -- the deterministic scoring works without any AI provider configured.
