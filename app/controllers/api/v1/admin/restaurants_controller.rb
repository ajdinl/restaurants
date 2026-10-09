# frozen_string_literal: true

module Api
  module V1
    module Admin
      class RestaurantsController < BaseController
        PERMITTED_PARAMS = %i[name slug address city phone email latitude longitude time_zone has_host].freeze

        before_action :set_restaurant, except: %i[index create]

        def index
          render_paginated(RestaurantSerializer, policy_scope([:admin, Restaurant]).order(:name))
        end

        def show
          authorize [:admin, @restaurant]
          render_success(RestaurantSerializer.render(@restaurant))
        end

        def create
          authorize [:admin, Restaurant]
          result = ::Admin::CreateRestaurant.call(user: current_user, params: restaurant_params)
          render_command_result(result, serializer: RestaurantSerializer, status: :created)
        end

        def update
          authorize [:admin, @restaurant]
          result = ::Admin::UpdateRestaurant.call(user: current_user, record: @restaurant, params: restaurant_params)
          render_command_result(result, serializer: RestaurantSerializer)
        end

        def suspend
          authorize [:admin, @restaurant]
          render_command_result(::Admin::SuspendRestaurant.call(user: current_user, record: @restaurant), serializer: RestaurantSerializer)
        end

        def activate
          authorize [:admin, @restaurant]
          render_command_result(::Admin::ActivateRestaurant.call(user: current_user, record: @restaurant), serializer: RestaurantSerializer)
        end

        def destroy
          authorize [:admin, @restaurant]
          result = ::Admin::DestroyRestaurant.call(user: current_user, record: @restaurant)
          result.success? ? head(:no_content) : render_errors(result.errors)
        end

        private

        def set_restaurant
          @restaurant = Restaurant.find_by!(slug: params.expect(:id))
        end

        def restaurant_params
          params.expect(restaurant: PERMITTED_PARAMS)
        end
      end
    end
  end
end
