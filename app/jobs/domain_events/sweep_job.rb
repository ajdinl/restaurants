# frozen_string_literal: true

module DomainEvents
  # Outbox housekeeping: re-enqueues events stuck undispatched and deletes old dispatched ones.
  class SweepJob < ApplicationJob
    queue_as :default

    STUCK_AFTER = 5.minutes
    KEEP_FOR = 90.days

    def perform
      DomainEvent.undispatched.where(occurred_at: ...STUCK_AFTER.ago).limit(1000).pluck(:id).each do |id|
        DispatchJob.perform_later(id)
      end
      DomainEvent.where(dispatched_at: ...KEEP_FOR.ago).in_batches.delete_all
    end
  end
end
