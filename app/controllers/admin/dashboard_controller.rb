# frozen_string_literal: true

module Admin
  class DashboardController < BaseController
    def show
      authorize %i[admin dashboard], :show?
      @restaurant_counts = Restaurant.group(:status).count
      @user_count = User.count
    end
  end
end
