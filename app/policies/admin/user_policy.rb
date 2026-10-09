# frozen_string_literal: true

module Admin
  class UserPolicy < ApplicationPolicy
    BASE_ATTRIBUTES = %i[full_name email locale].freeze

    def index?
      platform_staff?
    end

    def create?
      platform_staff?
    end

    # Moderators manage restaurant staff accounts, never platform staff (themselves included).
    def update?
      super_admin? || (moderator? && !record.platform_staff?)
    end

    def destroy?
      super_admin? && record != user
    end

    def permitted_attributes_for_create
      permitted_attributes + %i[password]
    end

    def permitted_attributes_for_update
      permitted_attributes
    end

    # Only super admins can grant platform roles, and never to themselves (no accidental self-demotion).
    def permitted_attributes
      super_admin? && record != user ? BASE_ATTRIBUTES + %i[platform_role] : BASE_ATTRIBUTES
    end

    class Scope < ApplicationPolicy::Scope
      def resolve
        platform_staff? ? scope.all : scope.none
      end
    end
  end
end
