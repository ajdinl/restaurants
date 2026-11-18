# frozen_string_literal: true

module DomainEvents
  # Hands one outbox event to its subscribers, once. Enqueued after the command's transaction commits;
  # SweepJob re-enqueues events that were never dispatched (e.g. the enqueue was lost in a crash).
  class DispatchJob < ApplicationJob
    queue_as :default

    def perform(event_id)
      event = DomainEvent.find_by(id: event_id)
      return if event.nil? || event.dispatched?

      event.with_lock { dispatch(event) unless event.dispatched? }
    end

    private

    def dispatch(event)
      with_event_tenant(event) do
        DomainEvents.handlers_for(event.name).each { |handler| handler.call(event) }
      end
      event.update!(dispatched_at: Time.current)
    end

    def with_event_tenant(event, &)
      event.restaurant ? ActsAsTenant.with_tenant(event.restaurant, &) : ActsAsTenant.without_tenant(&)
    end
  end
end
