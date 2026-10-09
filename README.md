# Restaurant Pro

Multi-tenant platform for restaurants: menus, tables, reservations, waiter ordering on tablets, kitchen display,
and table-side waiter calls with smartwatch notifications. UI in Bosnian and English.

> **Status:** foundation done: authentication, roles, restaurant workspaces, admin panel, bs/en.
> The previous Next.js + MongoDB version lives on `main` until this branch is merged.

## Architecture

| Part | Where | Stack |
|------|-------|-------|
| API | repo root | Ruby on Rails 8.1 (API only), PostgreSQL, Devise + devise-jwt, Pundit, acts_as_tenant |
| Web app | `frontend/` | Next.js (App Router) + TypeScript, Tailwind CSS, next-intl |
| Background jobs | `bin/jobs` | Solid Queue (PostgreSQL, no Redis) |
| Error monitoring | both | Sentry (enabled when a DSN is set) |

The browser only talks to Next.js. Next.js keeps the JWT in an httpOnly cookie and calls the Rails API
server-to-server, so the token is never exposed to browser JavaScript.

## Requirements

- Ruby 3.3.5 (see `.ruby-version` / `.tool-versions`)
- Node.js 22+
- PostgreSQL 15+ running locally (Postgres.app or Homebrew)

## Setup

```bash
bin/setup --skip-server     # gems, npm packages, databases
bin/rails db:seed           # demo restaurants and accounts
bin/dev                     # everything below, in one terminal
```

`bin/dev` starts:

| Process | URL |
|---------|-----|
| Rails API | http://localhost:3001 |
| Solid Queue worker | — |
| Next.js | http://localhost:3000 |

Demo login accounts are listed in the local `docs/DEMO_ACCOUNTS.md` (not in git).

## Roles

| Role | Scope | Can |
|------|-------|-----|
| Super admin | Platform | Everything, including deleting restaurants and managing moderators |
| Moderator | Platform | Onboard restaurants and staff, suspend restaurants, read-only support view. No permanent deletes, cannot manage platform staff |
| Owner / Manager | One restaurant | Menu, prices, tables, staff, settings |
| Host | One restaurant | Reservations, floor, walk-ins (optional per restaurant) |
| Waiter | One restaurant | Orders on tablet, table calls |
| Kitchen | One restaurant | Kitchen display |

A person can work in several restaurants with a different role in each.

## API

Versioned under `/api/v1`, JSON only.

- `POST /api/v1/auth/sign_in` returns the JWT in the `Authorization` header. `DELETE /api/v1/auth/sign_out` revokes it.
- Success responses: `{ "data": ..., "meta": ... }`. Errors: `{ "errors": [{ "field": ..., "message": ... }] }`,
  localized from `Accept-Language` (bs or en).
- Endpoints: `/me` (+ `/me/password`, `/me/avatar`), `/admin/dashboard`, `/admin/restaurants` (+ `memberships`), `/admin/users`,
  `/restaurants/:slug/dashboard`. See `config/routes.rb`.

## Security

- Every restaurant's data is isolated with acts_as_tenant, and a query without a tenant raises an error.
- Pundit denies everything by default, and every action is checked for authorization.
- Other restaurants' resources return 404 (existence is not revealed).
- JWTs expire after 12 hours, are revoked on sign-out, and a password change signs the user out everywhere
  except the device that made the change. Changing a password requires the current one.
- Profile photos: PNG, JPG or WebP up to 2 MB, type checked from the file content (SVG is rejected).
- Accounts lock after 10 failed sign-ins. Sign-in and password reset are rate limited per IP and per email.
  Password reset does not reveal whether an email exists.
- UUIDv7 primary keys. Database constraints back every model validation.

## Development

```bash
bundle exec rspec                 # API tests
bundle exec rubocop               # Ruby lint
bundle exec i18n-tasks missing    # bs/en API translations
bin/brakeman --no-pager           # security scan
bin/ci                            # everything CI runs (API + frontend)
```

Frontend scripts are in [frontend/README.md](./frontend/README.md). Coding conventions are in [CLAUDE.md](./CLAUDE.md).

## Environment variables

Development needs none. See [`.env.example`](./.env.example) and [`frontend/.env.example`](./frontend/.env.example).
Production requires `DEVISE_JWT_SECRET_KEY`, `FRONTEND_URL`, `API_URL`, `APP_HOST` and the `SUPER_ADMIN_*` variables for the
first seed. File uploads use local disk until a cloud storage service (S3 / Cloudflare R2) is configured.

## Production seed

In production `db:seed` only creates a super admin, from `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` (and optional
`SUPER_ADMIN_NAME`). It never creates default passwords.

## Deployment

Kamal 2 config is in `config/deploy.yml` (not configured yet).
