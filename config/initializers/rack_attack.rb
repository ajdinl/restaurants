# frozen_string_literal: true

# Throttles abusive traffic before it reaches Rails. Controller-level `rate_limit` covers sign-in per IP;
# these add per-email limits (spread-out password guessing) and a global per-IP ceiling.
module Rack
  class Attack
    # Rack::Request does not parse JSON bodies; ActionDispatch does.
    def self.email_param(req)
      ActionDispatch::Request.new(req.env).params.dig('user', 'email').to_s.downcase.strip.presence
    end

    throttle('api/ip', limit: 600, period: 5.minutes) do |req|
      req.ip if req.path.start_with?('/api/')
    end

    throttle('auth/sign_in/email', limit: 10, period: 15.minutes) do |req|
      email_param(req) if req.post? && req.path == '/api/v1/auth/sign_in'
    end

    throttle('auth/password/email', limit: 5, period: 1.hour) do |req|
      email_param(req) if req.post? && req.path == '/api/v1/auth/password'
    end

    self.throttled_responder = lambda do |_request|
      body = { errors: [{ field: nil, message: I18n.t('errors.rate_limited') }] }.to_json
      [429, { 'Content-Type' => 'application/json' }, [body]]
    end
  end
end
