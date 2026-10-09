# frozen_string_literal: true

module Api
  module V1
    module Workspace
      # Everything under /api/v1/restaurants/:restaurant_slug. Resolves the restaurant, checks the user
      # belongs to it and sets it as the acts_as_tenant tenant, so tenant-scoped queries stay inside it.
      class BaseController < Api::V1::BaseController
        before_action :set_restaurant
        around_action :use_restaurant_time_zone

        private

        def set_restaurant
          restaurant = Restaurant.find_by!(slug: params.expect(:restaurant_slug))
          membership = current_user.memberships.active.find_by(restaurant:)
          # 404 rather than 403, so outsiders do not learn which restaurants exist.
          raise ActiveRecord::RecordNotFound unless membership || current_user.platform_staff?

          Current.restaurant = restaurant
          Current.membership = membership
          set_current_tenant(restaurant)
          render_errors(t('errors.restaurant_suspended'), status: :forbidden) if restaurant.suspended? && !current_user.platform_staff?
        end

        def use_restaurant_time_zone(&)
          Time.use_zone(Current.restaurant.time_zone, &)
        end
      end
    end
  end
end
