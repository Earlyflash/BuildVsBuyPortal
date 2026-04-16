# Buy vs Build Portal

A GOV.UK-style assessment service that helps teams decide whether to **buy** an off-the-shelf solution or **build** a custom one.

The MVP combines:
- a weighted scoring model (strategic value, delivery constraints, economics and risk),
- Gartner-inspired decision gates (explicit buy/build/investigate signals),
- a final 2x2 gate-vs-score matrix, and
- a Gemini-powered narrative rationale with a safe fallback summary.

## What the solution does

- Guided multi-step wizard for project details, scoring inputs, and decision gates.
- Hybrid recommendation engine:
  - weighted score recommendation,
  - gate recommendation,
  - merged final recommendation (`Buy`, `Investigate`, `Build`).
- Results page with:
  - recommendation banner and spectrum,
  - gate/score 2x2 matrix with active quadrant highlight,
  - bucket breakdown and top drivers,
  - AI narrative section,
  - prompt reveal panel ("Show AI prompt"),
  - markdown export.
- Gemini behavior:
  - uses Gemini when configured and available,
  - falls back to deterministic narrative when unavailable,
  - displays source/status and fallback reason.

## Tech stack

- `Next.js` (App Router) + `TypeScript`
- GOV.UK frontend styles (served from `web/public/assets/`)
- `Vitest` for scoring engine tests

## Quick start

```bash
cd web
npm install
cp .env.example .env.local
```

Set your key in `web/.env.local`:

```bash
GEMINI_API_KEY=your_key_here
# Optional override:
# GEMINI_MODEL=gemini-2.0-flash
```

Security control env vars (optional, defaults are applied if omitted):

```bash
ASSESS_RATE_LIMIT_WINDOW_MS=60000
ASSESS_RATE_LIMIT_MAX_REQUESTS=30
LLM_RATE_LIMIT_WINDOW_MS=60000
LLM_RATE_LIMIT_MAX_REQUESTS=10
EXPOSE_RATIONALE_PROMPT=false
NEXT_PUBLIC_SHOW_PROMPT_DETAILS=false
NEXT_PUBLIC_ALLOW_PROMPT_EXPORT=false
```

Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation commands

```bash
cd web
npm test
npm run build
```

## Repository structure

| Path | Purpose |
|------|---------|
| `web/` | Next.js app (wizard, API route, results UI) |
| `web/src/server/` | Scoring engine + rationale generation |
| `web/src/domain/` | Shared data contracts and scoring config |
| `web/src/features/assessment-wizard/` | Wizard components and step flow |
| `docs/buy-vs-build-mvp.md` | Technical documentation |
| `.cursor/rules/` | MoJ coding-standards rules |
| `AGENTS.md` | Agent instructions for AI coding tools |

## Security and secrets

- Never commit API keys.
- `.env.local` is ignored by `.gitignore`.
- Gemini key is read server-side only.
- AI narratives are opt-in and blocked for high-sensitivity inputs.
- Provider error details are not exposed to end users.

### Key rotation runbook

1. Generate a new Gemini key with least privilege in the provider console.
2. Update deployment secret store and local `web/.env.local`.
3. Revoke the previous key immediately after rollout.
4. Verify by running one assessment with AI opt-in enabled.
5. Review usage telemetry for abnormal request spikes.

## Coding standards

This project follows [Ministry of Justice technical guidance](https://technical-guidance.service.justice.gov.uk/). Standards are enforced via `.cursor/rules/*.mdc` and `AGENTS.md`.

## Licence

Crown Copyright (Ministry of Justice). MIT Licence — see [LICENCE](LICENCE).
