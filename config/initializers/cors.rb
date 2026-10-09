# frozen_string_literal: true

# The Next.js server calls the API server-to-server, so browsers normally never hit it directly.
# Only the frontend origin is allowed in case a browser request does arrive.
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins Rails.configuration.x.frontend_url
    resource '/api/*', headers: :any, methods: %i[get post put patch delete options head], expose: %w[Authorization]
  end
end
