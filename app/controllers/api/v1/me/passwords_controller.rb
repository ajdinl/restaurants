# frozen_string_literal: true

module Api
  module V1
    module Me
      class PasswordsController < Api::V1::BaseController
        skip_after_action :verify_authorized

        # Slows down guessing the current password with a stolen session.
        rate_limit to: 5, within: 15.minutes, by: -> { current_user.id },
                   with: -> { render_errors(t('errors.rate_limited'), status: :too_many_requests) }

        def update
          result = Profile::ChangePassword.call(user: current_user, record: current_user, params: password_params)
          return render_errors(result.errors) if result.failure?

          # The old token died with the JTI rotation; hand this device a fresh one so it stays signed in.
          token, = Warden::JWTAuth::UserEncoder.new.call(current_user, :user, nil)
          response.headers['Authorization'] = "Bearer #{token}"
          head :no_content
        end

        private

        def password_params
          params.expect(user: %i[current_password password password_confirmation])
        end
      end
    end
  end
end
