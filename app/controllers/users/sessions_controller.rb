# frozen_string_literal: true

module Users
  class SessionsController < Devise::SessionsController
    # Per-IP throttle on top of Devise :lockable (which locks a single account after repeated failures).
    rate_limit to: 10, within: 3.minutes, only: :create,
               with: -> { redirect_to new_user_session_path, alert: t('errors.rate_limited') }
  end
end
