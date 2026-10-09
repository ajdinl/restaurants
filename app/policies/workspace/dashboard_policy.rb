# frozen_string_literal: true

module Workspace
  class DashboardPolicy < BasePolicy
    def show?
      read_access?
    end
  end
end
