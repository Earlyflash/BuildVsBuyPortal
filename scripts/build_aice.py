#!/usr/bin/env python3
"""
Build AICE (AI Coding Environment) artifacts from source/standards.yaml.

Generates:
  - .cursor/rules/*.mdc     (Cursor IDE)
  - .github/copilot-instructions.md  (GitHub Copilot)
  - AGENTS.md              (Cursor/Copilot agents, Claude, etc.)
  - docs/AICE-Standards.md (Human-readable reference with source links)

Run from repo root: python scripts/build_aice.py
Or: pip install pyyaml && python scripts/build_aice.py
"""

import os
import sys
from pathlib import Path
from datetime import datetime

try:
    import yaml
except ImportError:
    print("Install PyYAML: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_FILE = REPO_ROOT / "source" / "standards.yaml"
CURSOR_RULES_DIR = REPO_ROOT / ".cursor" / "rules"
GITHUB_DIR = REPO_ROOT / ".github"
DOCS_DIR = REPO_ROOT / "docs"


def load_source():
    with open(SOURCE_FILE, encoding="utf-8") as f:
        return yaml.safe_load(f)


def ensure_dirs():
    CURSOR_RULES_DIR.mkdir(parents=True, exist_ok=True)
    GITHUB_DIR.mkdir(parents=True, exist_ok=True)
    DOCS_DIR.mkdir(parents=True, exist_ok=True)


def escape_frontmatter(s):
    """Escape any --- in content for YAML frontmatter."""
    return s.replace("---", "\\---") if s else ""


def write_cursor_rules(data):
    """Generate .cursor/rules/*.mdc for Cursor."""
    # 1. Always-apply: PII + global principles
    always_parts = []
    for r in data.get("global_rules", []):
        always_parts.append(f"## {r['title']}\n\n{r['content']}\n")
    for r in data.get("principles", []):
        always_parts.append(f"## {r['title']}\n\n{r['content']}\n")
    always_content = "\n".join(always_parts)
    (CURSOR_RULES_DIR / "moj-global.mdc").write_text(
        f"""---
description: MoJ global rules and development principles (PII, security, principles)
alwaysApply: true
---

# MoJ Global Standards

{always_content}
""",
        encoding="utf-8",
    )

    # 2. General coding + design + testing + security + naming + licensing + CI/CD
    general_parts = []
    for r in data.get("coding_standards", []):
        general_parts.append(f"## {r['title']}\n\n{r['content']}\n")
    for r in data.get("naming_standards", []):
        general_parts.append(f"## {r['title']}\n\n{r['content']}\n")
    for r in data.get("licensing_standards", []):
        general_parts.append(f"## {r['title']}\n\n{r['content']}\n")
    for r in data.get("ai_governance", []):
        general_parts.append(f"## {r['title']}\n\n{r['content']}\n")
    general_content = "\n".join(general_parts)
    (CURSOR_RULES_DIR / "moj-coding-standards.mdc").write_text(
        f"""---
description: MoJ coding, design, testing, security, naming, licensing and AI governance
alwaysApply: false
---

# MoJ Coding and Governance Standards

{general_content}
""",
        encoding="utf-8",
    )

    # 3. Frontend
    frontend_parts = []
    for r in data.get("frontend_standards", []):
        frontend_parts.append(f"## {r['title']}\n\n{r['content']}\n")
    frontend_content = "\n".join(frontend_parts)
    (CURSOR_RULES_DIR / "moj-frontend.mdc").write_text(
        f"""---
description: MoJ frontend and accessibility standards
globs: ["**/*.tsx", "**/*.jsx", "**/*.vue", "**/*.html", "**/*.css", "**/*.scss"]
alwaysApply: false
---

# MoJ Frontend Standards

{frontend_content}
""",
        encoding="utf-8",
    )

    # 4. Python
    python_parts = []
    for r in data.get("python_standards", []):
        python_parts.append(f"## {r['title']}\n\n{r['content']}\n")
    python_content = "\n".join(python_parts)
    (CURSOR_RULES_DIR / "moj-python.mdc").write_text(
        f"""---
description: MoJ Python-specific principles
globs: ["**/*.py"]
alwaysApply: false
---

# MoJ Python Standards

{python_content}
""",
        encoding="utf-8",
    )

    # 5. Ruby
    ruby_parts = []
    for r in data.get("ruby_standards", []):
        ruby_parts.append(f"## {r['title']}\n\n{r['content']}\n")
    ruby_content = "\n".join(ruby_parts)
    (CURSOR_RULES_DIR / "moj-ruby.mdc").write_text(
        f"""---
description: MoJ Ruby-specific principles
globs: ["**/*.rb"]
alwaysApply: false
---

# MoJ Ruby Standards

{ruby_content}
""",
        encoding="utf-8",
    )


def write_copilot_instructions(data):
    """Generate .github/copilot-instructions.md (concise for Copilot)."""
    lines = [
        "# MoJ Repository – AI Coding Standards",
        "",
        "This repository follows **Ministry of Justice (MoJ) Technical Guidance** and Justice Digital standards. Apply these when generating or modifying code.",
        "",
        "## Critical",
        "- **Never** upload PII (personally identifiable information) or secrets to this repo.",
        "- Use GitHub for version control; feature branches; commits: `type(scope): description`; mandatory review before merge.",
        "",
        "## Code quality",
        "- Correct, clear, concise (in that order). Tests required for fixes and new features.",
        "- Meaningful names; avoid globals; comment only when necessary (explain why, not how).",
        "- Prefer composition over inheritance; small, single-responsibility units.",
        "- Follow language style guides (e.g. PEP 8 for Python). Max line length 120.",
        "",
        "## Design & APIs",
        "- SOLID principles; versioned APIs (e.g. /v1/...); OpenAPI/Swagger; RESTful.",
        "",
        "## Security",
        "- Parameterised queries; validate inputs; secure auth (OAuth 2.0/JWT); encrypt sensitive data; keep dependencies updated.",
        "",
        "## Frontend (when touching HTML/CSS/JS/TS)",
        "- Semantic HTML; accessibility (WCAG 2.2 AA); GOV.UK Design System where applicable; no inline styles; BEM/CSS Modules.",
        "",
        "## Licensing",
        "- MoJ uses MIT; Crown Copyright (Ministry of Justice). Include LICENCE in repo.",
        "",
        "## AI use",
        "- Use only approved MoJ AI tools; review all AI-generated output; no sensitive data into AI unless approved.",
        "",
        "Source: [MoJ Technical Guidance](https://technical-guidance.service.justice.gov.uk/).",
        "",
    ]
    (GITHUB_DIR / "copilot-instructions.md").write_text("\n".join(lines), encoding="utf-8")


def write_agents_md(data):
    """Generate AGENTS.md for Cursor/Copilot agents and similar tools."""
    sections = [
        "# MoJ AI Coding Environment (AICE) – Agent instructions",
        "",
        "When acting in this repository, follow Ministry of Justice technical guidance and coding standards summarised below.",
        "",
        "## Global rules",
        "",
    ]
    for r in data.get("global_rules", []):
        sections.append(f"### {r['title']}\n\n{r['content']}\n")
    sections.append("## Principles\n")
    for r in data.get("principles", []):
        sections.append(f"### {r['title']}\n\n{r['content']}\n")
    sections.append("## Coding standards\n")
    for r in data.get("coding_standards", []):
        sections.append(f"### {r['title']}\n\n{r['content']}\n")
    sections.append("## Frontend and accessibility\n")
    for r in data.get("frontend_standards", []):
        sections.append(f"### {r['title']}\n\n{r['content']}\n")
    sections.append("## Naming and licensing\n")
    for r in data.get("naming_standards", []) + data.get("licensing_standards", []):
        sections.append(f"### {r['title']}\n\n{r['content']}\n")
    sections.append("## AI governance\n")
    for r in data.get("ai_governance", []):
        sections.append(f"### {r['title']}\n\n{r['content']}\n")
    sections.append("---\n*Canonical source: [MoJ Technical Guidance](https://technical-guidance.service.justice.gov.uk/).*\n")
    (REPO_ROOT / "AGENTS.md").write_text("\n".join(sections), encoding="utf-8")


def write_human_docs(data):
    """Generate human-readable docs/AICE-Standards.md with links to sources."""
    meta = data.get("meta", {})
    sources = data.get("canonical_sources", [])
    lines = [
        "# MoJ AI Coding Environment (AICE) Standards",
        "",
        "Human-readable reference for Ministry of Justice coding standards, principles, and guidelines used by AI coding tools (Cursor, GitHub Copilot, etc.).",
        "",
        f"*Generated from `source/standards.yaml` (version {meta.get('version', 'N/A')}).*",
        "",
        "## Canonical sources",
        "",
        "| Document | Link |",
        "|----------|------|",
    ]
    for s in sources:
        lines.append(f"| {s['title']} | [{s['url'].split('/')[-1] or 'link'}]({s['url']}) |")
    lines.extend([
        "",
        "---",
        "",
        "## Summary of standards and principles",
        "",
        "### Critical (PII and security)",
        "- **Never upload PII** to MoJ GitHub repositories. Keep secrets out of source code.",
        "- [MoJ Technical Guidance – PII](https://technical-guidance.service.justice.gov.uk/)",
        "",
        "### Development principles",
        "- Share knowledge; use GitHub flow; all non-throwaway code reviewed.",
        "- Code: correct (with tests), clear, concise. Optimize for change.",
        "- Something simple that exists beats a perfect solution that doesn’t.",
        "- Everything fails: code defensively; fail fast; don’t block UX on long external calls.",
        "- Other developers are users: clear code, good commit messages, usable APIs.",
        "- Think smaller: Single Responsibility; small methods; composition over inheritance.",
        "- Names: self-descriptive; avoid puns, obscure acronyms, version numbers in names.",
        "- [Development Principles](https://technical-guidance.service.justice.gov.uk/documentation/principles/development-principles.html)",
        "",
        "### Coding standards",
        "- General: camelCase/PascalCase, max line 120, config not hard-coding, language style guides.",
        "- Version control: GitHub; feature/ branches; commits `type(scope): description`; mandatory review.",
        "- Design: SOLID; versioned APIs; OpenAPI/Swagger; UML for complex systems.",
        "- Testing: integration tests for major workflows; automated frameworks; meaningful coverage.",
        "- Security: vulnerability scanning; parameterised queries; input validation; encrypt sensitive data.",
        "- CI/CD: tests on every commit; staging before production; secure config (e.g. Key Vault).",
        "- [Justice Digital software engineering standards](https://technical-guidance.service.justice.gov.uk/documentation/standards/justice-digital-software-engineering-standards.html)",
        "",
        "### Frontend and accessibility",
        "- Semantic HTML; ARIA; GOV.UK Design System; WCAG 2.2 AA; keyboard and screen reader testing.",
        "- Responsive design; progressive enhancement; no premature optimisation.",
        "- [Justice Digital front end engineering standards](https://technical-guidance.service.justice.gov.uk/documentation/standards/justice-digital-front-end-engineering-standards.html)",
        "- [Frontend Development Principles](https://technical-guidance.service.justice.gov.uk/documentation/principles/frontend-development-principles.html)",
        "",
        "### Naming",
        "- Self-descriptive names; consistent (e.g. repo name ↔ hostname); avoid ambiguous or internal-only acronyms.",
        "- [Naming things](https://technical-guidance.service.justice.gov.uk/documentation/standards/naming-things.html)",
        "",
        "### Licensing",
        "- MIT License; LICENCE or LICENCE.md in each repo; Crown Copyright (Ministry of Justice); proper attribution for reused work.",
        "- [Licensing software or code](https://technical-guidance.service.justice.gov.uk/documentation/standards/licencing-software-or-code.html)",
        "",
        "### AI governance",
        "- Use only MoJ-approved AI tools; no sensitive/PII in AI unless TDA-approved; review all AI output; human in the loop.",
        "- [MOJ Engineering AI Governance Framework](https://technical-guidance.service.justice.gov.uk/documentation/governance/ai-governance-framework.html)",
        "",
        "---",
        "",
        "## How AICE artifacts are built",
        "",
        "Run from the repo root:",
        "",
        "```bash",
        "pip install pyyaml",
        "python scripts/build_aice.py",
        "```",
        "",
        "This generates:",
        "- `.cursor/rules/*.mdc` – Cursor IDE rules",
        "- `.github/copilot-instructions.md` – GitHub Copilot repository instructions",
        "- `AGENTS.md` – Agent instructions (Cursor, Copilot, Claude, etc.)",
        "- `docs/AICE-Standards.md` – this document",
        "",
        "CI/CD can run the same script (see `.github/workflows/build-aice.yml`).",
        "",
    ])
    (DOCS_DIR / "AICE-Standards.md").write_text("\n".join(lines), encoding="utf-8")


def main():
    if not SOURCE_FILE.exists():
        print(f"Source not found: {SOURCE_FILE}", file=sys.stderr)
        sys.exit(1)
    data = load_source()
    ensure_dirs()
    write_cursor_rules(data)
    write_copilot_instructions(data)
    write_agents_md(data)
    write_human_docs(data)
    print("AICE build complete:")
    print("  .cursor/rules/*.mdc")
    print("  .github/copilot-instructions.md")
    print("  AGENTS.md")
    print("  docs/AICE-Standards.md")


if __name__ == "__main__":
    main()
