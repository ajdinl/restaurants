# frozen_string_literal: true

module Api
  module V1
    module Workspace
      class DashboardController < BaseController
        def show
          authorize %i[workspace dashboard], :show?
          render_success({ restaurant: RestaurantSerializer.render(Current.restaurant),
                           role: Current.membership&.role,
                           support_view: Current.membership.nil? })
        end
      end
    end
  end
end
