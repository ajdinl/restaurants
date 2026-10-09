# frozen_string_literal: true

# Absolute URLs (Active Storage file links in API responses) point at the API's public address.
Rails.application.config.after_initialize do
  uri = URI.parse(Rails.configuration.x.api_url)
  Rails.application.routes.default_url_options = { host: uri.host, port: uri.port, protocol: uri.scheme }
end
