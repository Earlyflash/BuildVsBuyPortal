# MoJ AI Coding Environment (AICE) Standards

Ministry of Justice (UK) **AI Coding Environment standards** for use with Cursor, GitHub Copilot, Codex, and other major AICE tools. This repo is the single source of truth and build pipeline for MoJ coding standards, principles, and guidelines consumed by AI assistants.

## What’s in this repo

| Item | Purpose |
|------|--------|
| **`source/standards.yaml`** | Single source of truth: principles, coding standards, frontend, naming, licensing, AI governance. Edit here to change all generated outputs. |
| **`.cursor/rules/*.mdc`** | Cursor IDE rules (global + file-type-specific). Applied automatically when using Cursor. |
| **`.github/copilot-instructions.md`** | GitHub Copilot repository instructions. Used by Copilot when working in a repo that includes or copies these instructions. |
| **`AGENTS.md`** | Agent instructions for Cursor, Copilot agents, Claude (CLAUDE.md-style), and similar tools. |
| **`docs/AICE-Standards.md`** | Human-readable reference with links to canonical MoJ sources. |
| **`scripts/build_aice.py`** | Build script: reads `source/standards.yaml` and regenerates all of the above. |
| **`.github/workflows/build-aice.yml`** | CI/CD: runs the build on push (to `source/` or `scripts/`) or manually; uploads AICE artifacts. |

## Canonical sources (MoJ)

Standards are derived from:

- [MoJ Technical Guidance](https://technical-guidance.service.justice.gov.uk/)
- [Justice Digital software engineering standards](https://technical-guidance.service.justice.gov.uk/documentation/standards/justice-digital-software-engineering-standards.html)
- [Justice Digital front end engineering standards](https://technical-guidance.service.justice.gov.uk/documentation/standards/justice-digital-front-end-engineering-standards.html)
- [Development Principles](https://technical-guidance.service.justice.gov.uk/documentation/principles/development-principles.html)
- [Frontend Development Principles](https://technical-guidance.service.justice.gov.uk/documentation/principles/frontend-development-principles.html)
- [Naming things](https://technical-guidance.service.justice.gov.uk/documentation/standards/naming-things.html)
- [Licensing software or code](https://technical-guidance.service.justice.gov.uk/documentation/standards/licencing-software-or-code.html)
- [MOJ Engineering AI Governance Framework](https://technical-guidance.service.justice.gov.uk/documentation/governance/ai-governance-framework.html)
- [ministryofjustice GitHub](https://github.com/ministryofjustice) (e.g. template-repository)

For how these and other MoJ repos are used to discover and maintain standards, see [docs/Discovering-MoJ-Standards.md](docs/Discovering-MoJ-Standards.md).

## Using the standards in AICE tools

### Cursor

- **In this repo:** Open the repo in Cursor; `.cursor/rules/*.mdc` are picked up automatically.
- **In another MoJ repo:** Copy the contents of `.cursor/rules/` into that repo’s `.cursor/rules/`, or add this repo as a submodule and symlink/copy the rule files. Alternatively, ensure your project’s Cursor rules reference or include the MoJ global/coding/frontend rules.

### GitHub Copilot

- **Repository instructions:** Copy `.github/copilot-instructions.md` into your repo’s `.github/copilot-instructions.md` (or merge its content into your existing file). Copilot will use it for that repository.
- **Path-specific:** For path-specific instructions, add `.github/instructions/` and `NAME.instructions.md` files as per [GitHub’s docs](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot); you can derive content from `source/standards.yaml` or from `docs/AICE-Standards.md`.

### Other tools (Codex, Claude, Gemini, etc.)

- **AGENTS.md / CLAUDE.md / GEMINI.md:** Copy or adapt `AGENTS.md` into your repo as `AGENTS.md`, `CLAUDE.md`, or `GEMINI.md` as required by the tool. Many agents use the nearest such file in the directory tree.
- **Custom instructions:** Paste the summary from `docs/AICE-Standards.md` (or the “Summary of standards and principles” section) into the tool’s project or account-level custom instructions if supported.

### Human reference

- Share **`docs/AICE-Standards.md`** (or link to it) for a readable overview and links to the official MoJ pages.

## Rebuilding AICE artifacts (CI/CD)

All generated artifacts can be rebuilt from `source/standards.yaml` so updates stay in one place and can be automated.

### Local build

```bash
cd MoJ-AICE-StandardsRepo
pip install -r requirements.txt
python scripts/build_aice.py
```

Generated/updated:

- `.cursor/rules/*.mdc`
- `.github/copilot-instructions.md`
- `AGENTS.md`
- `docs/AICE-Standards.md`

### CI/CD (GitHub Actions)

- Workflow: **`.github/workflows/build-aice.yml`**
- Triggers: push to `main` that touches `source/**` or `scripts/**`, or manual **Run workflow**.
- The workflow runs `scripts/build_aice.py` and uploads the generated files as the **aice-artifacts** artifact.
- Optionally, you can enable a step in the workflow to commit the generated files back to the repo (see commented block in the workflow).

## Updating standards

1. Edit **`source/standards.yaml`** (add/change principles, coding standards, frontend, naming, licensing, AI governance, etc.).
2. Run **`python scripts/build_aice.py`** locally (or rely on CI after pushing).
3. Commit both `source/standards.yaml` and the updated generated files (if you keep them in the repo).
4. Use or copy the updated `.cursor/rules/`, `.github/copilot-instructions.md`, and `AGENTS.md` into target repos or tool configs as above.

## Licence

Crown Copyright (Ministry of Justice). See [LICENCE](LICENCE) in this repo (or apply MoJ’s standard MIT licence as per [MoJ licensing guidance](https://technical-guidance.service.justice.gov.uk/documentation/standards/licencing-software-or-code.html)).
