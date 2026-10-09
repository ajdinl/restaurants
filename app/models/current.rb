# frozen_string_literal: true

class Current < ActiveSupport::CurrentAttributes
  attribute :user, :restaurant, :membership
end
