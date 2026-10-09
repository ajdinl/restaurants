# frozen_string_literal: true

module Admin
  class RestaurantPolicy < ApplicationPolicy
    def index?
      platform_staff?
    end

    def show?
      platform_staff?
    end

    def create?
      platform_staff?
    end

    def update?
      platform_staff?
    end

    def suspend?
      platform_staff? && record.active?
    end

    def activate?
      platform_staff? && record.suspended?
    end

    # Permanent deletion is irreversible, so moderators can only suspend.
    def destroy?
      super_admin?
    end

    class Scope < ApplicationPolicy::Scope
      def resolve
        platform_staff? ? scope.all : scope.none
      end
    end
  end
end
