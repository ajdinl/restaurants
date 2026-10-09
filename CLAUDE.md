# Restaurants

Multi-tenant SaaS for restaurants: menus, tables, reservations, waiter ordering, kitchen display, waiter calls.

- **Backend (repo root):** Rails 8.1 JSON API (`config.api_only`), Ruby 3.3.5, PostgreSQL, Devise + devise-jwt,
  Solid Queue / Solid Cable / Solid Cache (no Redis).
- **Frontend (`frontend/`):** Next.js + TypeScript (App Router), Tailwind, next-intl. See `frontend/README.md`
  (BFF auth, design tokens, the ticket-rail design language).

## Commands

```bash
bin/dev                              # API :3001 + Solid Queue worker + Next.js :3000
bin/rails db:prepare db:seed         # Create, migrate, seed demo data (DEMO_PASSWORD, default password123)
bundle exec rspec                    # Tests
bundle exec rubocop                  # Lint
bundle exec i18n-tasks missing       # bs/en translation parity (also: unused)
bin/brakeman --no-pager              # Security scan
bin/ci                               # Everything CI runs, locally
```

## Areas

| Area | Routes | Controllers | Who |
|------|--------|-------------|-----|
| Auth | `/api/v1/auth/sign_in`, `sign_out`, `password` | `Api::V1::Auth::` (Devise) | Everyone |
| Me | `/api/v1/me` | `Api::V1::MeController` | Signed-in user |
| Admin | `/api/v1/admin/...` | `Api::V1::Admin::` (inherit `Api::V1::Admin::BaseController`) | Super admin, moderator |
| Workspace | `/api/v1/restaurants/:restaurant_slug/...` | `Api::V1::Workspace::` (inherit `Api::V1::Workspace::BaseController`) | Restaurant staff (+ platform staff for support) |

Commands and policies live in top-level `Admin::` / `Workspace::` modules, so call commands as `::Admin::CreateRestaurant`
from inside `Api::V1::Admin`. The app module is `RestaurantsApp`. Never create a `Restaurants::` namespace.

### Auth (JWT, BFF)
- Sign-in returns the JWT in the `Authorization` response header (12 h). Sign-out revokes it (JTIMatcher). Changing the
  password rotates `jti`, signing the user out everywhere.
- The Next.js server keeps the token in an httpOnly cookie and calls the API server-to-server, forwarding
  `Accept-Language` and `X-Forwarded-For`. Browser JavaScript never sees the token.
- Devise failures (401) go through `JsonFailureApp`. `Api::V1::BaseController` skips `:trackable` on token requests.

## Roles

- `User#platform_role`: `super_admin` (everything) or `moderator` (support, onboarding, suspend; no permanent deletes, cannot manage platform staff). `nil` for everyone else.
- `Membership#role` per restaurant: `owner`, `manager`, `host`, `waiter`, `kitchen`. One membership per user per restaurant. `active: false` revokes access.
- `Restaurant#has_host`: when false, host features go to managers/waiters.

## Architecture Patterns

### Commands
All business logic lives in `app/commands/{area}/`, inheriting `ApplicationCommand`.
- Call: `Admin::CreateRestaurant.call(user: current_user, params: ..., record: ...)`.
- Return `ApplicationCommand::Result` (`success?`, `failure?`, `value`, `errors`). On failure `value` is the invalid record so forms re-render with errors.
- `record:` is the already-authorized record. Commands never re-fetch it, so authorization always applies to exactly what gets modified.
- Simple CRUD: `include SimpleCreate` + `creates Model`, or `include SimpleUpdate`.
- Notifications, state transitions, broadcasts and audit side effects belong in commands, never in controllers.

### Thin Controllers
```ruby
def update
  authorize [:admin, @restaurant]
  result = ::Admin::UpdateRestaurant.call(user: current_user, record: @restaurant, params: restaurant_params)
  render_command_result(result, serializer: RestaurantSerializer)
end
```
Max ~5 lines per action. No business logic, no queries beyond loading the record.

### Responses
- Success: `{ data: ... }` (+ `meta: { page, per_page, total, total_pages }` from `render_paginated`).
- Errors: `{ errors: [{ field, message }] }` via `render_errors` / `ErrorHandler` (404 not found, 403 forbidden,
  400 missing params, 401 Devise, 422 validation, 429 throttled). Messages are localized and never name models.
- Serializers: `jsonapi-serializer`, inheriting `ApplicationSerializer`, rendered flat (`{ id, ...attributes }`) with
  `XSerializer.render(record_or_collection)`. Serializers are dumb: preload in the controller, no queries.
- Never serialize secrets (`encrypted_password`, `jti`, tokens). Whitelist attributes explicitly.
- File URLs: `rails_blob_url` with host from `API_URL` (`config/initializers/default_url_options.rb`). Preload with
  `includes(avatar_attachment: :blob)` (not `with_attached_*`, which Bullet flags for unused variant preloads).
- Uploads: validate content type (detected from bytes) and size in the model; never accept SVG for images.

### Authorization (Pundit)
- `ApplicationPolicy` **denies everything by default**. Each policy allows actions explicitly.
- Policies receive an `AuthorizationContext` (`user`, `restaurant`, `membership`) with `super_admin?`, `moderator?`, `platform_staff?`, `member?`, `role?(*roles)`, `management?`.
- Namespaced: `authorize [:admin, record]`, `policy_scope([:admin, Model])`. Headless: `authorize %i[workspace dashboard], :show?`.
- `verify_authorized` runs after every non-index action and `verify_policy_scoped` after every index. Opt out only with explicit `skip_after_action`.
- Workspace policies inherit `Workspace::BasePolicy`: `read_access?` (member or platform staff), `staff_with?(*roles)` (super admin or role).
- Role-dependent params: `permitted_attributes_for_create` / `_for_update` in the policy (e.g. only super admins may set `platform_role`).

### Multi-tenancy (acts_as_tenant)
- Tenant = `Restaurant`. Every restaurant-owned model does `include MultiTenant`. Do NOT add `belongs_to :restaurant` yourself.
- `require_tenant = true`: a tenant-scoped query without a tenant **raises**. `Workspace::BaseController` sets the tenant from the slug after checking membership. `Admin::BaseController` wraps actions in `ActsAsTenant.without_tenant`.
- Jobs, seeds, console: `ActsAsTenant.with_tenant(restaurant) { ... }`.
- `User`, `Restaurant`, `Membership` are not tenant-scoped (they span restaurants). Scope them explicitly (`@restaurant.memberships.find`).

### Security Rules
- Outsiders get **404, not 403**, for other restaurants' resources and for `/admin`, so record existence never leaks. Use 403 (`errors/forbidden`) only inside the user's own restaurant.
- Load child records through their parent (`@restaurant.memberships.find(id)`), never `Model.find(id)` on tenant-crossing data.
- Separate create/update params when create needs fields update must not allow (e.g. `password`).
- Never hardcode secrets or ENV fallbacks for production. Seeds create no default passwords in production.
- API CSP is `default-src 'none'; frame-ancestors 'none'`. CORS allows only `FRONTEND_URL`.
- Devise: lockable (10 attempts, 15 min), paranoid mode, min 10-char passwords. Sign-in and password reset are rate
  limited per IP (`rate_limit`) and per email (Rack::Attack, `config/initializers/rack_attack.rb`).
- Production must run Next.js behind a proxy that appends `X-Forwarded-For`; per-IP rate limits depend on it.
- Treat blank ENV values as unset (`ENV['X'].presence`), raising in production when a required one is missing.
- Brakeman and bundler-audit must be clean.

### Models
- Primary keys are **UUIDv7** (set in `ApplicationRecord`), so they are time-ordered and not guessable. Restaurants use `slug` in URLs (`to_param`).
- Section order: `include` → constants → `enum` → associations → scopes → validations → callbacks → public methods → private methods.
- Enums are string-backed: `enum :status, { active: 'active', ... }, validate: true`. Mirror them with a DB check constraint.
- Every `has_many` has an explicit `dependent:` and an inverse `belongs_to`.
- **Validate in the model and enforce in the DB**: NOT NULL, foreign keys, unique indexes, check constraints. Use exclusion constraints for overlaps (e.g. reservations).
- Money: integer cents (money-rails when prices arrive). Never floats.
- No `default_scope` (soft delete uses explicit `.kept`).
- Date pairs (start/end) validate end >= start. Numeric business fields validate `numericality`.

### Migrations
- `strong_migrations` is on. Put indexes and check constraints inside `create_table` for new tables.
- Use `type: :uuid` on references.

## i18n: Mandatory bs + en

- Default locale `bs`, also `en`. API messages go in **both** `config/locales/*.bs.yml` and `*.en.yml`; UI text lives in
  `frontend/messages/{bs,en}.json`. Never hardcode text.
- Model and attribute names live in `activerecord.*` (used in validation messages).
- Missing translations raise in dev and test. `spec/i18n_spec.rb` fails on missing or unused keys; `npm run i18n:check`
  does the same for the frontend.
- Avoid dynamic keys (`t(cond ? 'a' : 'b')`). Write `cond ? t('a') : t('b')` so i18n-tasks can see them.
- API locale: `Accept-Language` (sent by the frontend; hr/sr map to bs) > `user.locale` > `bs` (`LocaleResolver`).

## Testing (RSpec + FactoryBot + Shoulda)

- Every command: success and failure paths (plus state checks).
- Every policy: an allow/deny matrix per role. Every new route: request specs for an outsider (404), a wrong role (403), and the happy path.
- Every association and validation has a spec. Use manual specs for scoped uniqueness.
- Tenant models: `ActsAsTenant.current_tenant = restaurant` in `before`. It is reset after each example.
- Request specs authenticate with `headers: auth_headers_for(user, locale:)` and read `json` / `error_messages`.
  Policy specs build contexts with `context_for(user, restaurant:)`.
- Bullet raises on N+1 in tests. Fix with `includes`.

## New Resource Checklist

Migration (constraints!) → model (+ `MultiTenant`) → factory → commands → policy (`Workspace::BasePolicy`) → serializer →
API controller → routes → locale keys (bs + en) → model/command/policy/request specs → frontend types, API calls, pages and
messages (bs + en) → `bundle exec rubocop` and `bin/ci`.

## RuboCop

Single quotes, `# frozen_string_literal: true`, max line length 160. Run `bundle exec rubocop -A` on changed files before committing.
