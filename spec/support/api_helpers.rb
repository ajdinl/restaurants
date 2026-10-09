# frozen_string_literal: true

require 'devise/jwt/test_helpers'

module ApiHelpers
  def auth_headers_for(user, locale: 'bs')
    headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json', 'Accept-Language' => locale }
    Devise::JWT::TestHelpers.auth_headers(headers, user)
  end

  def json
    response.parsed_body
  end

  def error_messages
    json['errors'].pluck('message')
  end
end
