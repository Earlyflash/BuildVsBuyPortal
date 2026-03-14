# Discovering standards from MoJ GitHub repos

This document describes where MoJ standards and patterns live and how they feed into `source/standards.yaml`.

## Primary source: MoJ Technical Guidance

The **canonical** source for published standards is:

- **[technical-guidance.service.justice.gov.uk](https://technical-guidance.service.justice.gov.uk/)**

It hosts:

- Development and frontend principles  
- Justice Digital software and front end engineering standards  
- Naming, licensing, hosting, support, and related standards  
- AI governance framework  

The content in `source/standards.yaml` is aligned with these pages and links to them in the human-readable docs.

## MoJ GitHub organisation

- **[github.com/ministryofjustice](https://github.com/ministryofjustice)** – all MoJ source code is open by default here.

Useful repos for **patterns and conventions** (not necessarily “standards” in the strict sense):

| Repo | Use |
|------|-----|
| [template-repository](https://github.com/ministryofjustice/template-repository) | Default licence, .gitignore, GitHub Actions; use as base for new repos. |
| [template-microservice-repository](https://github.com/ministryofjustice/template-microservice-repository) | Microservice layout and patterns. |
| [operations-engineering](https://github.com/ministryofjustice/operations-engineering) | Referenced for tooling and operations; previous github-repository-standards content moved here. |
| [technical-guidance](https://github.com/ministryofjustice/technical-guidance) | Source for the Technical Guidance site (if you need to propose or trace changes to the published docs). |

## How to add or refresh standards from MoJ repos

1. **Technical Guidance** – When guidance pages change, update `source/standards.yaml` to match (and add/update `canonical_sources` links), then run `scripts/build_aice.py`.
2. **Template repos** – Check `template-repository` and `template-microservice-repository` for:
   - Linting/test/CI config (e.g. GitHub Actions) → reflect in coding/CI standards in `standards.yaml` if they become policy.
   - Licence and README patterns → already reflected in licensing and naming.
3. **CONTRIBUTING / README** – If a widely used MoJ repo has a CONTRIBUTING.md or README section that defines team standards, extract the relevant bullets into `source/standards.yaml` and add the repo URL to `canonical_sources`.
4. **Rebuild** – After any change to `source/standards.yaml`, run the build script (or CI) to regenerate Cursor rules, Copilot instructions, AGENTS.md, and `docs/AICE-Standards.md`.

Keeping **Technical Guidance** as the primary source and **GitHub repos** as pattern references keeps AICE standards aligned with official MoJ policy while still reflecting current engineering practice.
