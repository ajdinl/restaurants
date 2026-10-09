# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Admin::RestaurantPolicy do
  let(:super_admin) { context_for(create(:user, :super_admin)) }
  let(:moderator) { context_for(create(:user, :moderator)) }
  let(:owner) { context_for(create(:membership, :owner, restaurant:).user) }
  let(:restaurant) { create(:restaurant) }

  permissions :index?, :show?, :create?, :update?, :suspend? do
    it { expect(described_class).to permit(super_admin, restaurant) }
    it { expect(described_class).to permit(moderator, restaurant) }
    it { expect(described_class).not_to permit(owner, restaurant) }
  end

  permissions :destroy? do
    it { expect(described_class).to permit(super_admin, restaurant) }
    it { expect(described_class).not_to permit(moderator, restaurant) }
    it { expect(described_class).not_to permit(owner, restaurant) }
  end

  permissions :suspend? do
    it { expect(described_class).not_to permit(super_admin, build(:restaurant, :suspended)) }
  end

  permissions :activate? do
    it { expect(described_class).to permit(moderator, build(:restaurant, :suspended)) }
    it { expect(described_class).not_to permit(moderator, restaurant) }
  end

  describe 'scope' do
    before { restaurant }

    it 'returns every restaurant for platform staff and none for others' do
      expect(Admin::RestaurantPolicy::Scope.new(moderator, Restaurant).resolve).to contain_exactly(restaurant)
      expect(Admin::RestaurantPolicy::Scope.new(owner, Restaurant).resolve).to be_empty
    end
  end

  it 'rejects anonymous callers' do
    expect { described_class.new(nil, restaurant) }.to raise_error(Pundit::NotAuthorizedError)
  end
end
