# frozen_string_literal: true

module Workspace
  # The change history (PaperTrail versions) of one restaurant.
  class ActivityPolicy < BasePolicy
    def index?
      management? || platform_staff?
    end
  end
end
