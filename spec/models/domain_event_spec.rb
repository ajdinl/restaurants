# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DomainEvent do
  subject(:event) { described_class.new(name: 'restaurant.updated', occurred_at: Time.current) }

  it { is_expected.to belong_to(:restaurant).optional }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:occurred_at) }

  it 'requires dotted lowercase names' do
    expect(described_class.new(name: 'RestaurantUpdated', occurred_at: Time.current)).not_to be_valid
    expect(described_class.new(name: 'restaurant', occurred_at: Time.current)).not_to be_valid
  end

  it 'enforces the name format in the database' do
    expect { described_class.insert!({ name: 'Bad', occurred_at: Time.current }) }.to raise_error(ActiveRecord::StatementInvalid) # rubocop:disable Rails/SkipsModelValidations
  end

  it 'enqueues its dispatch after commit' do
    expect { event.save! }.to have_enqueued_job(DomainEvents::DispatchJob).with(event.id)
  end

  it 'is deleted with its restaurant' do
    restaurant = create(:restaurant)
    described_class.create!(name: 'restaurant.updated', occurred_at: Time.current, restaurant:)
    expect { restaurant.destroy! }.to change(described_class, :count).by(-1)
  end
end
