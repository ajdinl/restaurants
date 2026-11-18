# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DomainEvents::SweepJob do
  def event(**attributes)
    DomainEvent.create!(name: 'restaurant.updated', occurred_at: Time.current, **attributes)
  end

  it 're-enqueues events that were never dispatched' do
    stuck = event(occurred_at: 10.minutes.ago)
    fresh = event
    ActiveJob::Base.queue_adapter.enqueued_jobs.clear
    described_class.perform_now
    expect(DomainEvents::DispatchJob).to have_been_enqueued.with(stuck.id)
    expect(DomainEvents::DispatchJob).not_to have_been_enqueued.with(fresh.id)
  end

  it 'deletes dispatched events after the retention period' do
    old = event(dispatched_at: 91.days.ago)
    recent = event(dispatched_at: 1.day.ago)
    described_class.perform_now
    expect(DomainEvent.where(id: [old.id, recent.id]).pluck(:id)).to eq([recent.id])
  end
end
