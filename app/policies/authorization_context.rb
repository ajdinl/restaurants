# frozen_string_literal: true

# Everything a policy knows about the caller: the user and, inside a restaurant workspace,
# the restaurant and the user's membership there (nil for platform staff without one).
AuthorizationContext = Data.define(:user, :restaurant, :membership) do
  def initialize(user:, restaurant: nil, membership: nil)
    super
  end

  delegate :super_admin?, :moderator?, :platform_staff?, to: :user

  def member?
    membership.present?
  end

  def role?(*roles)
    member? && roles.map(&:to_s).include?(membership.role)
  end

  def management?
    role?(*Membership::MANAGEMENT_ROLES)
  end
end
