# frozen_string_literal: true

module Api
  module V1
    # Authenticated API. Every non-index action must call `authorize`, every index `policy_scope`.
    class BaseController < ApplicationController
      include Pundit::Authorization
      include Pagination

      set_current_tenant_through_filter

      # JWT authenticates every request; without this Devise :trackable would count each one as a sign-in.
      prepend_before_action { request.env['devise.skip_trackable'] = true }
      before_action :authenticate_user!
      before_action :set_current_user
      after_action :verify_authorized, unless: -> { action_name == 'index' }
      after_action :verify_policy_scoped, if: -> { action_name == 'index' }

      private

      def pundit_user
        AuthorizationContext.new(user: current_user, restaurant: Current.restaurant, membership: Current.membership)
      end

      def set_current_user
        Current.user = current_user
      end
    end
  end
end
