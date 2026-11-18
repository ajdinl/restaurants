# frozen_string_literal: true

module Workspace
  # Restaurant profile and settings (headless: `authorize %i[workspace settings], :update?`).
  class SettingsPolicy < BasePolicy
    def show?
      read_access?
    end

    def update?
      staff_with?(:owner, :manager)
    end
  end
end
