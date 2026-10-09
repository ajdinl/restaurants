# frozen_string_literal: true

module Admin
  class MembershipPolicy < ApplicationPolicy
    def create?
      platform_staff?
    end

    def update?
      platform_staff?
    end

    def destroy?
      platform_staff?
    end
  end
end
