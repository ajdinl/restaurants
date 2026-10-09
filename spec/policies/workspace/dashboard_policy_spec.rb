# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Workspace::DashboardPolicy do
  let(:restaurant) { create(:restaurant) }

  permissions :show? do
    it 'allows members of the restaurant' do
      waiter = create(:membership, :waiter, restaurant:).user
      expect(described_class).to permit(context_for(waiter, restaurant:), :dashboard)
    end

    it 'allows platform staff for support' do
      expect(described_class).to permit(context_for(create(:user, :moderator), restaurant:), :dashboard)
    end

    it 'denies members of other restaurants' do
      outsider = create(:membership, :owner).user
      expect(described_class).not_to permit(context_for(outsider, restaurant:), :dashboard)
    end

    it 'denies inactive members' do
      former = create(:membership, :waiter, :inactive, restaurant:).user
      expect(described_class).not_to permit(context_for(former, restaurant:), :dashboard)
    end
  end
end
