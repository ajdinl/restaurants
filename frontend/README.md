# Restaurant Pro: frontend

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4. UI in Bosnian (default) and English via next-intl.

## How it talks to the API

The Rails API (`../`, port 3001) issues a JWT on sign-in. This app acts as a backend-for-frontend:

- Server actions call the API from the Next.js server and keep the JWT in an httpOnly `session` cookie.
  Browser JavaScript never sees the token.
- `src/lib/api.ts` (server-only) adds the token, the UI language (`Accept-Language`) and the client IP
  (`X-Forwarded-For`, used by the API's rate limits) to every request.
- An expired or revoked token sends the user to `/session/expired`, which clears the cookie.
- `src/proxy.ts` only checks that the cookie exists. Authorization is always decided by the API.
  `src/lib/permissions.ts` mirrors the API policies just to hide actions the user cannot take.

## Setup

```bash
npm install
cp .env.example .env.local   # optional in development
npm run dev                  # http://localhost:3000 (start the API on :3001 first)
```

From the repo root, `bin/dev` starts the API, the job worker and this app together.

## Scripts

| Script                            | What it does                                                   |
| --------------------------------- | -------------------------------------------------------------- |
| `npm run dev`                     | Development server on port 3000                                |
| `npm run build` / `npm start`     | Production build / server                                      |
| `npm run lint`                    | ESLint                                                         |
| `npm run typecheck`               | TypeScript (`tsc --noEmit`)                                    |
| `npm run format` / `format:check` | Prettier                                                       |
| `npm run i18n:check`              | Fails if `messages/bs.json` and `messages/en.json` keys differ |

## Environment

| Variable                                | Purpose                                              |
| --------------------------------------- | ---------------------------------------------------- |
| `API_URL`                               | Rails API base URL (default `http://localhost:3001`) |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring (server / browser). Off when empty  |

## Conventions

- Every UI string lives in `messages/*.json` (both languages). Translation keys are type-checked.
- Server components by default. Client components only for forms and interactive bits.
- Mutations go through server actions in `src/actions/`. Forms use `useActionState` and show the API's
  (already translated) errors.
