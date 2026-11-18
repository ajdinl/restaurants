# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DomainEvents::DispatchJob do
  let(:restaurant) { create(:restaurant) }
  let(:event) { DomainEvent.create!(name: 'restaurant.updated', occurred_at: Time.current, restaurant:) }
  let(:calls) { [] }
  let(:handler) { ->(e) { calls << [e.id, ActsAsTenant.current_tenant] } }

  before { DomainEvents.subscribe('restaurant.updated', handler) }
  after { DomainEvents.reset! }

  it 'calls the subscribers with the restaurant as tenant and marks the event dispatched' do
    described_class.perform_now(event.id)
    expect(calls).to eq([[event.id, restaurant]])
    expect(event.reload).to be_dispatched
  end

  it 'calls wildcard subscribers too' do
    wildcard = []
    DomainEvents.subscribe('*', ->(e) { wildcard << e.name })
    described_class.perform_now(event.id)
    expect(wildcard).to eq(['restaurant.updated'])
  end

  it 'dispatches platform events without a tenant' do
    platform_event = DomainEvent.create!(name: 'restaurant.updated', occurred_at: Time.current)
    described_class.perform_now(platform_event.id)
    expect(calls).to eq([[platform_event.id, nil]])
  end

  it 'dispatches each event only once' do
    2.times { described_class.perform_now(event.id) }
    expect(calls.size).to eq(1)
  end

  it 'leaves the event undispatched when a subscriber fails, so it is retried' do
    DomainEvents.subscribe('restaurant.updated', ->(_e) { raise 'boom' })
    expect { described_class.perform_now(event.id) }.to raise_error('boom')
    expect(event.reload).not_to be_dispatched
  end

  it 'ignores events that no longer exist' do
    expect { described_class.perform_now(SecureRandom.uuid) }.not_to raise_error
  end
end
