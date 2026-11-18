# frozen_string_literal: true

module Workspace
  class MenuItemPolicy < BasePolicy
    def index?
      read_access?
    end

    def manage?
      staff_with?(:owner, :manager)
    end

    # Marking an item sold out ("86") and back.
    def availability?
      staff_with?(:owner, :manager, :kitchen)
    end
  end
end
