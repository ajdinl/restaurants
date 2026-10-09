# frozen_string_literal: true

module Admin
  class DashboardPolicy < ApplicationPolicy
    def show?
      platform_staff?
    end
  end
end
