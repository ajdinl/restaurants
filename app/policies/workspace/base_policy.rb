# frozen_string_literal: true

module Workspace
  # Base for everything inside a restaurant workspace. Platform staff may look at any restaurant
  # (support); only members with the right role, or super admins, may change things.
  class BasePolicy < ApplicationPolicy
    private

    def read_access?
      member? || platform_staff?
    end

    def staff_with?(*roles)
      super_admin? || role?(*roles)
    end
  end
end
