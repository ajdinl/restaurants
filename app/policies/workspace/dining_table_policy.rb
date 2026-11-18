# frozen_string_literal: true

module Workspace
  class DiningTablePolicy < BasePolicy
    def index?
      read_access?
    end

    def manage?
      staff_with?(:owner, :manager)
    end
  end
end
