# frozen_string_literal: true

module Api
  module V1
    module Admin
      class DashboardController < BaseController
        def show
          authorize %i[admin dashboard], :show?
          counts = Restaurant.group(:status).count
          render_success({ restaurants: { total: counts.values.sum, active: counts.fetch('active', 0), suspended: counts.fetch('suspended', 0) },
                           users: User.count })
        end
      end
    end
  end
end
