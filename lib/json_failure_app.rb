# frozen_string_literal: true

# Devise failures (bad credentials, expired or revoked token, locked account) in the API error format.
class JsonFailureApp < Devise::FailureApp
  def respond
    I18n.with_locale(LocaleResolver.resolve(request.headers['Accept-Language'])) do
      self.status = :unauthorized
      self.content_type = 'application/json'
      self.response_body = { errors: [{ field: nil, message: i18n_message }] }.to_json
    end
  end
end
