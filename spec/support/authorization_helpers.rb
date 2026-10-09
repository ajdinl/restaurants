# frozen_string_literal: true

module AuthorizationHelpers
  def context_for(user, restaurant: nil)
    membership = restaurant && user.memberships.active.find_by(restaurant:)
    AuthorizationContext.new(user:, restaurant:, membership:)
  end
end

RSpec.configure do |config|
  config.include AuthorizationHelpers, type: :policy
end
