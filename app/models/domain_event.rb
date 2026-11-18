# frozen_string_literal: true

# One entry in the domain event outbox (D36). Written by `ApplicationCommand#publish` in the same transaction
# as the change, then handed to subscribers by DomainEvents::DispatchJob after commit.
# Not tenant-scoped: platform events have no restaurant and the dispatcher works across restaurants.
class DomainEvent < ApplicationRecord
  NAME_FORMAT = /\A[a-z_]+(\.[a-z_]+)+\z/

  belongs_to :restaurant, optional: true

  scope :undispatched, -> { where(dispatched_at: nil) }

  validates :name, presence: true, format: { with: NAME_FORMAT }
  validates :occurred_at, presence: true

  after_create_commit :enqueue_dispatch

  def dispatched?
    dispatched_at.present?
  end

  private

  def enqueue_dispatch
    DomainEvents::DispatchJob.perform_later(id)
  end
end
