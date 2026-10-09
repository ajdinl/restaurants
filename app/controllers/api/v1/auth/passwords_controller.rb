# frozen_string_literal: true

module Api
  module V1
    module Auth
      class PasswordsController < Devise::PasswordsController
        rate_limit to: 5, within: 15.minutes, only: :create,
                   with: -> { render_errors(t('errors.rate_limited'), status: :too_many_requests) }

        # The reset form lives in the frontend (/reset-password?token=...).
        def new
          head :not_found
        end

        def edit
          head :not_found
        end

        # Same answer whether or not the email exists (paranoid mode).
        def create
          resource_class.send_reset_password_instructions(resource_params)
          render_success({ message: t('devise.passwords.send_paranoid_instructions') }, status: :accepted)
        end

        def update
          user = resource_class.reset_password_by_token(resource_params)
          return render_errors(user.errors.errors) if user.errors.any?

          user.unlock_access! if user.access_locked?
          render_success({ message: t('devise.passwords.updated_not_active') })
        end
      end
    end
  end
end
