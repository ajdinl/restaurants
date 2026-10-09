# frozen_string_literal: true

module Admin
  class MembershipPolicy < ApplicationPolicy
    def index?
      platform_staff?
    end

    def create?
      platform_staff?
    end

    def update?
      platform_staff?
    end

    def destroy?
      platform_staff?
    end

    class Scope < ApplicationPolicy::Scope
      def resolve
        platform_staff? ? scope.all : scope.none
      end
    end
  end
end
