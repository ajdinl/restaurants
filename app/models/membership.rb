# frozen_string_literal: true

class Membership < ApplicationRecord
  MANAGEMENT_ROLES = %w[owner manager].freeze

  enum :role, { owner: 'owner', manager: 'manager', host: 'host', waiter: 'waiter', kitchen: 'kitchen' }, validate: true

  belongs_to :user
  belongs_to :restaurant

  scope :active, -> { where(active: true) }

  validates :user_id, uniqueness: { scope: :restaurant_id }

  def management?
    MANAGEMENT_ROLES.include?(role)
  end
end
