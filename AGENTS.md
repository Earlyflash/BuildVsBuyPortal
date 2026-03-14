# MoJ AI Coding Environment (AICE) – Agent instructions

When acting in this repository, follow Ministry of Justice technical guidance and coding standards summarised below.

## Global rules

### PII and GitHub – Never upload PII

**Critical**: Never upload Personally Identifiable Information (PII) to any MoJ GitHub repository.
PII includes birthdate, race, passport/NI number, or any data that could identify an individual.
Keep secrets separate from source code and never commit them.

## Principles

### Share the knowledge

If you have unique knowledge, share it. Use GitHub flow: small, short-lived branches.
All non-throwaway code must be reviewed. Package reusable work (e.g. PyPI, rubygems) and share via MoJ Reusables where appropriate.

### Code should be correct, clear, concise – in that order

Correct means provably correct – with tests. All fixes and new features must include tests.
Choose clarity over cleverness; avoid monkey-patching and meta-programming unless justified.
DRY: apply the Rule of Three for duplication. Less code is better, but not at the expense of clarity.

### Optimize for change

Focus on making code easy to change. Don't prematurely optimize – choose clarity over performance unless there is a serious performance issue.

### Something simple which exists is better than a perfect solution which doesn't

Get it done, get it in front of users, learn early. Don't over-engineer. Follow Least Surprise.
Don't roll your own crypto. Handle exceptions at the app level. Use process concurrency over threading unless there is good reason.

### Everything fails, all of the time

Code defensively when calling other services. Every HTTP call can error or hang – handle failures and fail fast.
Don't let long-running external calls harm user experience.

### Other developers are users too

If you have to explain how your code works, it's not clear enough. Comments explain *why*, not *how*.
Commit messages: follow GDS guidance (e.g. type(scope): description). APIs need designing for usability. Don't pollute the global namespace.

### Think smaller

Single Responsibility Principle. Keep views, controllers, models simple; keep methods short.
Many small simple things are better than one big complex thing. Consider Null Object, Facade, Form Objects, Sandi Metz's rules.

### Names have power – use them wisely

Don't be cute or jokey. Names convey meaning; well-named functions and variables can remove the need for comments.
Avoid meaningless names (obj, result, foo). Use single-letter variables only for well-known maths (e.g. e = mc²) or when meaning is clear.
Names should be self-descriptive. Avoid puns, uncommon acronyms, version numbers, or brand names in ways that obscure purpose.

### Composition over inheritance

Prefer 'has-a' over 'is-a' (e.g. Car has-a Motor, not Car is-a MotorVehicle). Inheritance trees often create tech debt.

## Coding standards

### General coding standards

- Comment only where necessary; prefer self-explanatory code.
- camelCase for variables, PascalCase for classes.
- Avoid hard-coded values; use configuration or constants.
- Max line length 120 characters.
- Meaningful names for variables, classes, methods.
- Follow language-specific style guides (e.g. PEP 8 for Python, Google Java style for Java).

### Version control and branching

Use GitHub for all projects. Branching: feature/* for features, develop for integration, main for production-ready code.
Commit messages: include ticket/issue reference; format type(scope): description (e.g. feat(auth): add JWT authentication); imperative mood.
Mandatory code review before merging to main (readability, test coverage, security).

### Design standards

Apply SOLID: single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.
Use design patterns where appropriate (e.g. Factory, Observer). Document architecture with UML for complex systems.
APIs: version (e.g. /v1/users), use OpenAPI/Swagger, RESTful design.

### Testing standards

Code reviews mandatory before merge. Integration tests for major workflows. Use automated frameworks (e.g. JUnit, PyTest).
Confirm unit test coverage for critical modules with technical lead. Tests and assertions must be meaningful.

### Security standards

Regular vulnerability scans (e.g. OWASP, SonarQube). Keep dependencies updated.
Secure auth (OAuth 2.0, JWT). Encrypt sensitive data at rest (AES 256) and in transit (TLS).
Parameterised queries to prevent SQL injection. Validate all relevant inputs (server and client).

### Deployment and CI/CD

CI with automated tests on every commit. CD for staging. Deploy to staging before production.
Keep environment-specific config secure (e.g. Azure Key Vault). Use GitHub Actions or Azure DevOps.

## Frontend and accessibility

### HTML and CSS standards

Use semantic HTML and accessibility attributes (ARIA). Minimise !important; maintain specificity hierarchy.
Avoid inline styles; use external stylesheets or CSS-in-JS. Keep CSS modular (e.g. BEM, CSS Modules, Tailwind).

### JavaScript/TypeScript frontend

Enforce strict typing with TypeScript. Use ES6+. Implement error handling; avoid silent failures.
Avoid global variables; use modules or closures. Use ESLint. Prefer React, Angular, or Vue as approved; state management Redux or Zustand.

### Accessibility (WCAG AA)

Meet WCAG 2.2 Level AA (legal requirement for public sector). Use GOV.UK Design System components.
Alt text for images, ARIA for dynamic elements, keyboard navigation, focus management. Test with screen readers and automated tools (Axe, Pa11y, WAVE).
Support browser zoom to 400%; logical headings; meaningful link text; descriptive page titles; colour contrast.

### Government Service Manual

Follow the Government Service Design Manual. Services are assessed against it before going live.
Use verified browsers list; responsive design; progressive enhancement.

## Naming and licensing

### Naming things

Names must be self-descriptive. Avoid puns, uncommon acronyms, version numbers, or brand names that obscure purpose.
Use the same name consistently (e.g. GitHub repo name matches hostname). Prefer: Peoplefinder, Send Money to a Prisoner, Help with Fees.
Avoid: ambiguous names, internal acronyms (e.g. CCCD, PVB2, DOMIS).

### Licensing software or code

MoJ uses the MIT License. Each repo must include LICENCE or LICENCE.md with full licence text.
Copyright: "Copyright (c) YYYY Crown Copyright (Ministry of Justice)". Use UK spelling "Licence" where preferred.
When reusing others' work, provide proper attribution in the licence file.

## AI governance

### AI tooling and governance

Use only MoJ-approved AI tools (e.g. GitHub Copilot for engineers; follow current approved list).
No ingestion of personal data or sensitive security data by AI unless TDA-approved.
Review all AI-generated outputs for accuracy; apply in line with organisational guidance.
Human in the loop: clear accountability; document AI use; maintain transparency and auditability.

---
*Canonical source: [MoJ Technical Guidance](https://technical-guidance.service.justice.gov.uk/).*
