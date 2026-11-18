# frozen_string_literal: true

module Workspace
  class ContextPolicy < BasePolicy
    def show?
      read_access?
    end
  end
end
