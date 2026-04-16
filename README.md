# Buy vs Build Portal

A guided assessment tool that helps teams decide whether to **buy** an off-the-shelf solution or **build** a custom one for their project.

Users answer a series of questions about strategic value, delivery constraints, and economics. The portal produces a recommendation on the buy-to-build spectrum with an explainable confidence band and, optionally, an AI-generated rationale narrative.

## Quick start

```bash
cd web
npm install
cp .env.example .env.local   # add your GEMINI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Do not commit `.env.local`** — it contains your API key. The root `.gitignore` already excludes it.

## Project structure

| Path | Purpose |
|------|---------|
| `web/` | Next.js TypeScript application |
| `.cursor/rules/` | MoJ coding-standards rules for Cursor |
| `AGENTS.md` | Agent instructions for AI coding tools |
| `docs/` | Product and technical documentation |

## Coding standards

This project follows [Ministry of Justice technical guidance](https://technical-guidance.service.justice.gov.uk/). Standards are enforced via `.cursor/rules/*.mdc` and `AGENTS.md`.

## Licence

Crown Copyright (Ministry of Justice). MIT Licence — see [LICENCE](LICENCE).
