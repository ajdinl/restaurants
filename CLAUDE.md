# Restaurants

Multi-tenant SaaS for restaurants: menus, tables, reservations, waiter ordering, kitchen display, waiter calls.
Rails 8.1 full-stack (Hotwire + Tailwind), Ruby 3.3.5, PostgreSQL. Solid Queue / Solid Cable / Solid Cache (no Redis).

## Commands

```bash
bin/dev                              # Server + Tailwind watcher (http://localhost:3000)
bin/rails db:prepare db:seed         # Create, migrate, seed demo data (password: password123)
bundle exec rspec                    # Tests
bundle exec rubocop                  # Lint
bundle exec i18n-tasks missing       # bs/en translation parity (also: unused)
bin/brakeman --no-pager              # Security scan
bin/ci                               # Everything CI runs, locally
```

## Areas

| Area | Routes | Controllers | Who |
|------|--------|-------------|-----|
| Admin | `/admin/...` | `Admin::` (inherit `Admin::BaseController`) | Super admin, moderator |
| Workspace | `/r/:restaurant_slug/...` | `Workspace::` (inherit `Workspace::BaseController`) | Restaurant staff (+ platform staff for support) |
| Auth | `/users/...` | Devise (`Users::SessionsController`) | Everyone |

The app module is `RestaurantsApp`. Never create a `Restaurants::` namespace.

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
  result = Admin::UpdateRestaurant.call(user: current_user, record: @restaurant, params: restaurant_params)
  return render(:edit, status: :unprocessable_content) if result.failure?

  redirect_to admin_restaurant_path(@restaurant), notice: t('.success')
end
```
Max ~5 lines per action. No business logic, no queries beyond loading the record.

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
- Strict CSP with per-request nonces (`config/initializers/content_security_policy.rb`). No inline scripts or styles. Use Stimulus.
- Devise: lockable (10 attempts, 15 min), paranoid mode, min 10-char passwords. Sign-in is rate limited per IP.
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

### Views
- Tailwind component classes in `app/assets/tailwind/application.css`: `btn btn-primary|btn-secondary|btn-danger`, `btn-link`, `card`, `input`, `label`, `checkbox`, `badge badge-green|red|gray`, `table`, `page-title`.
- Enum labels: `enum_label(Model, :attr, value)`, select options: `enum_options(Model, :attr)`.
- Destructive buttons use `button_to ... form: { data: { turbo_confirm: t('...') } }`.
- Layout must work on tablets (waiters, kitchen) and phones.

## i18n: Mandatory bs + en

- Default locale `bs`, also `en`. Every user-facing string goes in **both** `config/locales/*.bs.yml` and `*.en.yml`. Never hardcode text.
- Lazy lookups in views and controllers (`t('.title')`). Model and attribute names live in `activerecord.*`, enum values in `activerecord.attributes.<model>.<plural_attr>.<value>`.
- Missing translations raise in dev and test. `spec/i18n_spec.rb` fails on missing or unused keys.
- Avoid dynamic keys (`t(cond ? 'a' : 'b')`). Write `cond ? t('a') : t('b')` so i18n-tasks can see them.
- Locale resolution: session choice > `user.locale` > Accept-Language (hr/sr map to bs) > `bs`.

## Testing (RSpec + FactoryBot + Shoulda)

- Every command: success and failure paths (plus state checks).
- Every policy: an allow/deny matrix per role. Every new route: request specs for an outsider (404), a wrong role (403), and the happy path.
- Every association and validation has a spec. Use manual specs for scoped uniqueness.
- Tenant models: `ActsAsTenant.current_tenant = restaurant` in `before`. It is reset after each example.
- Request specs sign in with `sign_in user` (Devise helpers). Policy specs build contexts with `context_for(user, restaurant:)`.
- Bullet raises on N+1 in tests. Fix with `includes`.

## New Resource Checklist

Migration (constraints!) → model (+ `MultiTenant`) → factory → commands → policy (`Workspace::BasePolicy`) → controller → views → routes → locale keys (bs + en) → model/command/policy/request specs → `bundle exec rubocop` and `bin/ci`.

## RuboCop

Single quotes, `# frozen_string_literal: true`, max line length 160. Run `bundle exec rubocop -A` on changed files before committing.
