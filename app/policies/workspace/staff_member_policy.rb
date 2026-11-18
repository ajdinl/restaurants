# frozen_string_literal: true

module Workspace
  # Memberships seen as restaurant staff. Record-level rules (which roles a manager may touch, the last owner)
  # arrive with the staff screen in step 1.4; `manage?` is the capability shown in abilities.
  class StaffMemberPolicy < BasePolicy
    def index?
      management? || platform_staff?
    end

    def manage?
      staff_with?(:owner, :manager)
    end
  end
end
