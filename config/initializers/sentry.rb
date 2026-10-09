# frozen_string_literal: true

# Error monitoring. Off unless SENTRY_DSN is set, so development and tests send nothing.
if ENV['SENTRY_DSN'].present?
  Sentry.init do |config|
    config.dsn = ENV.fetch('SENTRY_DSN')
    config.environment = ENV.fetch('SENTRY_ENVIRONMENT', Rails.env)
    config.breadcrumbs_logger = %i[active_support_logger http_logger]
    config.send_default_pii = false
    config.traces_sample_rate = ENV.fetch('SENTRY_TRACES_SAMPLE_RATE', '0.1').to_f
  end
end
