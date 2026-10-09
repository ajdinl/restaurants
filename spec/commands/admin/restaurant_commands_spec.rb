# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Admin restaurant commands' do
  let(:admin) { create(:user, :super_admin) }

  describe Admin::CreateRestaurant do
    it 'creates a restaurant' do
      result = described_class.call(user: admin, params: { name: 'Novi Restoran' })
      expect(result).to be_success
      expect(result.value).to be_persisted
      expect(result.value.slug).to eq('novi-restoran')
    end

    it 'returns the invalid record with errors' do
      result = described_class.call(user: admin, params: { name: '' })
      expect(result).to be_failure
      expect(result.value).to be_new_record
      expect(result.errors).to be_present
    end
  end

  describe Admin::UpdateRestaurant do
    let(:restaurant) { create(:restaurant) }

    it 'updates the restaurant' do
      result = described_class.call(user: admin, record: restaurant, params: { city: 'Tuzla' })
      expect(result).to be_success
      expect(restaurant.reload.city).to eq('Tuzla')
    end

    it 'fails on invalid input without saving' do
      result = described_class.call(user: admin, record: restaurant, params: { name: '' })
      expect(result).to be_failure
      expect(restaurant.reload.name).to be_present
    end
  end

  describe Admin::SuspendRestaurant do
    it 'suspends an active restaurant' do
      restaurant = create(:restaurant)
      expect(described_class.call(user: admin, record: restaurant)).to be_success
      expect(restaurant.reload).to be_suspended
    end

    it 'fails when already suspended' do
      result = described_class.call(user: admin, record: create(:restaurant, :suspended))
      expect(result).to be_failure
      expect(result.errors).to include(a_string_including('suspend'))
    end
  end

  describe Admin::ActivateRestaurant do
    it 'activates a suspended restaurant' do
      restaurant = create(:restaurant, :suspended)
      expect(described_class.call(user: admin, record: restaurant)).to be_success
      expect(restaurant.reload).to be_active
    end

    it 'fails when already active' do
      expect(described_class.call(user: admin, record: create(:restaurant))).to be_failure
    end
  end

  describe Admin::DestroyRestaurant do
    it 'deletes the restaurant and its memberships' do
      membership = create(:membership)
      expect(described_class.call(user: admin, record: membership.restaurant)).to be_success
      expect(Restaurant.exists?(membership.restaurant_id)).to be(false)
      expect(Membership.exists?(membership.id)).to be(false)
    end
  end
end
