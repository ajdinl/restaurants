# frozen_string_literal: true

module Api
  module V1
    module Auth
      # devise-jwt adds the token (Authorization header) on sign-in and revokes it on sign-out.
      class SessionsController < Devise::SessionsController
        skip_before_action :require_no_authentication, :verify_signed_out_user

        # Per-IP throttle on top of Devise :lockable (which locks a single account after repeated failures).
        rate_limit to: 10, within: 3.minutes, only: :create,
                   with: -> { render_errors(t('errors.rate_limited'), status: :too_many_requests) }

        def new
          head :not_found
        end

        def create
          user = warden.authenticate!(auth_options.merge(store: false))
          render_success(CurrentUserSerializer.render(User.includes(memberships: :restaurant, avatar_attachment: :blob).find(user.id)))
        end

        def destroy
          head :no_content
        end
      end
    end
  end
end
