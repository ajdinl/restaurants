# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Membership do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:restaurant) }
  end

  describe 'validations' do
    it 'allows one membership per user per restaurant' do
      existing = create(:membership)
      duplicate = build(:membership, user: existing.user, restaurant: existing.restaurant)
      expect(duplicate).not_to be_valid
    end

    it 'allows the same user in different restaurants' do
      existing = create(:membership)
      expect(build(:membership, user: existing.user)).to be_valid
    end

    it 'rejects unknown roles' do
      expect(build(:membership, role: 'chef')).not_to be_valid
    end
  end

  describe '#management?' do
    it 'is true for owners and managers only' do
      expect(build(:membership, :owner)).to be_management
      expect(build(:membership, :manager)).to be_management
      expect(build(:membership, :waiter)).not_to be_management
    end
  end

  it 'scopes active memberships' do
    active = create(:membership)
    create(:membership, :inactive)
    expect(described_class.active).to contain_exactly(active)
  end
end
