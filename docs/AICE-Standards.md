# MoJ AI Coding Environment (AICE) Standards

Human-readable reference for Ministry of Justice coding standards, principles, and guidelines used by AI coding tools (Cursor, GitHub Copilot, etc.).

*Generated from `source/standards.yaml` (version 1.0.0).*

## Canonical sources

| Document | Link |
|----------|------|
| MoJ Technical Guidance | [technical-guidance.service.justice.gov.uk](https://technical-guidance.service.justice.gov.uk/) |
| Justice Digital software engineering standards | [justice-digital-software-engineering-standards.html](https://technical-guidance.service.justice.gov.uk/documentation/standards/justice-digital-software-engineering-standards.html) |
| Justice Digital front end engineering standards | [justice-digital-front-end-engineering-standards.html](https://technical-guidance.service.justice.gov.uk/documentation/standards/justice-digital-front-end-engineering-standards.html) |
| Development Principles | [development-principles.html](https://technical-guidance.service.justice.gov.uk/documentation/principles/development-principles.html) |
| Frontend Development Principles | [frontend-development-principles.html](https://technical-guidance.service.justice.gov.uk/documentation/principles/frontend-development-principles.html) |
| Naming things | [naming-things.html](https://technical-guidance.service.justice.gov.uk/documentation/standards/naming-things.html) |
| Licensing software or code | [licencing-software-or-code.html](https://technical-guidance.service.justice.gov.uk/documentation/standards/licencing-software-or-code.html) |
| MOJ Engineering AI Governance Framework | [ai-governance-framework.html](https://technical-guidance.service.justice.gov.uk/documentation/governance/ai-governance-framework.html) |
| ministryofjustice GitHub | [github.com/ministryofjustice](https://github.com/ministryofjustice) |
| Template repository | [template-repository](https://github.com/ministryofjustice/template-repository) |

---

## Summary of standards and principles

### Critical (PII and security)

- **Never upload PII** to MoJ GitHub repositories. Keep secrets out of source code.
- [MoJ Technical Guidance – PII](https://technical-guidance.service.justice.gov.uk/)

### Development principles

- Share knowledge; use GitHub flow; all non-throwaway code reviewed.
- Code: correct (with tests), clear, concise. Optimize for change.
- Something simple that exists beats a perfect solution that doesn’t.
- Everything fails: code defensively; fail fast; don’t block UX on long external calls.
- Other developers are users: clear code, good commit messages, usable APIs.
- Think smaller: Single Responsibility; small methods; composition over inheritance.
- Names: self-descriptive; avoid puns, obscure acronyms, version numbers in names.
- [Development Principles](https://technical-guidance.service.justice.gov.uk/documentation/principles/development-principles.html)

### Coding standards

- General: camelCase/PascalCase, max line 120, config not hard-coding, language style guides.
- Version control: GitHub; feature/ branches; commits `type(scope): description`; mandatory review.
- Design: SOLID; versioned APIs; OpenAPI/Swagger; UML for complex systems.
- Testing: integration tests for major workflows; automated frameworks; meaningful coverage.
- Security: vulnerability scanning; parameterised queries; input validation; encrypt sensitive data.
- CI/CD: tests on every commit; staging before production; secure config (e.g. Key Vault).
- [Justice Digital software engineering standards](https://technical-guidance.service.justice.gov.uk/documentation/standards/justice-digital-software-engineering-standards.html)

### Frontend and accessibility

- Semantic HTML; ARIA; GOV.UK Design System; WCAG 2.2 AA; keyboard and screen reader testing.
- Responsive design; progressive enhancement; no premature optimisation.
- [Justice Digital front end engineering standards](https://technical-guidance.service.justice.gov.uk/documentation/standards/justice-digital-front-end-engineering-standards.html)
- [Frontend Development Principles](https://technical-guidance.service.justice.gov.uk/documentation/principles/frontend-development-principles.html)

### Naming

- Self-descriptive names; consistent (e.g. repo name ↔ hostname); avoid ambiguous or internal-only acronyms.
- [Naming things](https://technical-guidance.service.justice.gov.uk/documentation/standards/naming-things.html)

### Licensing

- MIT License; LICENCE or LICENCE.md in each repo; Crown Copyright (Ministry of Justice); proper attribution for reused work.
- [Licensing software or code](https://technical-guidance.service.justice.gov.uk/documentation/standards/licencing-software-or-code.html)

### AI governance

- Use only MoJ-approved AI tools; no sensitive/PII in AI unless TDA-approved; review all AI output; human in the loop.
- [MOJ Engineering AI Governance Framework](https://technical-guidance.service.justice.gov.uk/documentation/governance/ai-governance-framework.html)

---

## How AICE artifacts are built

Run from the repo root:

```bash
pip install pyyaml
python scripts/build_aice.py
```

This generates:

- `.cursor/rules/*.mdc` – Cursor IDE rules
- `.github/copilot-instructions.md` – GitHub Copilot repository instructions
- `AGENTS.md` – Agent instructions (Cursor, Copilot, Claude, etc.)
- `docs/AICE-Standards.md` – this document

CI/CD can run the same script (see `.github/workflows/build-aice.yml`).

For discovering and adding standards from other MoJ GitHub repos, see [Discovering-MoJ-Standards.md](Discovering-MoJ-Standards.md).
