# frozen_string_literal: true

# The signed-in user with the restaurants they can open. Expects memberships: :restaurant preloaded.
class CurrentUserSerializer < ApplicationSerializer
  attributes :email, :full_name, :platform_role, :locale

  attribute :memberships do |user|
    user.memberships.select(&:active?).map do |membership|
      restaurant = membership.restaurant
      { id: membership.id, role: membership.role,
        restaurant: { id: restaurant.id, slug: restaurant.slug, name: restaurant.name, status: restaurant.status } }
    end
  end
end
