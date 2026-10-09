# frozen_string_literal: true

ActsAsTenant.configure do |config|
  # A tenant-scoped query without a tenant raises instead of silently reading every restaurant's data.
  # Admin controllers opt out explicitly with ActsAsTenant.without_tenant; jobs and seeds use with_tenant.
  config.require_tenant = true
end
