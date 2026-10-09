# Restaurants

Multi-tenant platform for restaurants: menus, tables, reservations, waiter ordering on tablets, kitchen display,
and table-side waiter calls with smartwatch notifications. UI in Bosnian and English.

> **Status:** Phase 0 (foundation) is done: authentication, roles, restaurant workspaces, admin panel, bs/en.
> **Next:** the Rails app becomes a JSON API (`/api/v1`, devise-jwt) and the UI moves to a Next.js + TypeScript app in `frontend/`.
> The previous Next.js + MongoDB version lives on `main` until this branch is merged.

## Tech stack

- **Ruby on Rails 8.1** (Ruby 3.3.5), Hotwire (Turbo + Stimulus), Tailwind CSS 4, importmap (no Node needed)
- **PostgreSQL** for data, background jobs (Solid Queue), realtime (Solid Cable) and cache (Solid Cache). No Redis.
- **Devise** (auth), **Pundit** (authorization), **acts_as_tenant** (restaurant isolation)
- **RSpec**, FactoryBot, Shoulda Matchers, RuboCop, Brakeman, bundler-audit, i18n-tasks

## Requirements

- Ruby 3.3.5 (see `.ruby-version` / `.tool-versions`)
- PostgreSQL 15+ running locally (Postgres.app or Homebrew)

## Setup

```bash
bin/setup --skip-server     # install gems, prepare the database
bin/rails db:seed           # demo data
bin/dev                     # http://localhost:3000
```

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

## Security

- Every restaurant's data is isolated with acts_as_tenant, and a query without a tenant raises an error.
- Pundit denies everything by default, and every action is checked for authorization.
- Other restaurants' resources return 404 (existence is not revealed).
- Accounts lock after 10 failed sign-ins, sign-in is rate limited per IP, and password reset does not reveal whether an email exists.
- Strict Content Security Policy with per-request nonces.
- UUIDv7 primary keys. Database constraints back every model validation.

## Development

```bash
bundle exec rspec                 # tests
bundle exec rubocop               # lint
bundle exec i18n-tasks missing    # bs/en translation parity
bin/brakeman --no-pager           # security scan
bin/ci                            # everything CI runs
```

Coding conventions are in [CLAUDE.md](./CLAUDE.md).

## Environment variables

Development needs none. See [`.env.example`](./.env.example) for production settings (`SUPER_ADMIN_*`, `APP_HOST`, `MAILER_FROM`,
`DATABASE_URL`, `RAILS_MASTER_KEY`). Copy it to `.env` (gitignored).

## Production seed

In production `db:seed` only creates a super admin, from `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` (and optional
`SUPER_ADMIN_NAME`). It never creates default passwords.

## Deployment

Kamal 2 config is in `config/deploy.yml` (not configured yet).
