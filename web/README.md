# Web App

Next.js app for the Buy vs Build assessment.

## Setup

```bash
npm install
cp .env.example .env.local
```

Set required values in `.env.local`:

```bash
GEMINI_API_KEY=replace_with_real_key
```

Then run:

```bash
npm run dev
```

## Security defaults

- `/api/assess` is rate-limited and validates request schema and body size.
- Gemini narrative generation is opt-in and blocked for high-sensitivity content.
- Prompt visibility/export is off by default and should remain disabled in production.
- Provider error details are mapped to safe reason codes.

## Key rotation runbook

1. Issue a new Gemini key in the provider account.
2. Update secret values in all environments (`.env.local`, CI/CD secrets, hosting platform).
3. Revoke the previous key.
4. Validate the service by submitting an opt-in assessment.
5. Review provider usage logs for anomalies.

## Validation commands

```bash
npm run lint
npm test
npm run build
```
