# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Admin membership commands' do
  let(:admin) { create(:user, :super_admin) }
  let(:restaurant) { create(:restaurant) }

  describe Admin::AddMember do
    it 'adds an existing user by email (case-insensitive)' do
      member = create(:user, email: 'konobar@example.com')
      result = described_class.call(user: admin, record: restaurant, params: { email: ' Konobar@Example.com ', role: 'waiter' })
      expect(result).to be_success
      expect(restaurant.memberships.find_by(user: member)).to be_waiter
    end

    it 'fails for an unknown email' do
      result = described_class.call(user: admin, record: restaurant, params: { email: 'nobody@example.com', role: 'waiter' })
      expect(result).to be_failure
      expect(restaurant.memberships).to be_empty
    end

    it 'fails when the user is already a member' do
      existing = create(:membership, restaurant:)
      result = described_class.call(user: admin, record: restaurant, params: { email: existing.user.email, role: 'host' })
      expect(result).to be_failure
    end

    it 'fails for an invalid role' do
      member = create(:user)
      result = described_class.call(user: admin, record: restaurant, params: { email: member.email, role: 'chef' })
      expect(result).to be_failure
    end
  end

  describe Admin::UpdateMember do
    it 'changes the role and active flag' do
      membership = create(:membership, :waiter)
      expect(described_class.call(user: admin, record: membership, params: { role: 'host', active: false })).to be_success
      expect(membership.reload).to have_attributes(role: 'host', active: false)
    end

    it 'fails for an invalid role' do
      expect(described_class.call(user: admin, record: create(:membership), params: { role: 'chef' })).to be_failure
    end
  end

  describe Admin::RemoveMember do
    it 'removes the membership' do
      membership = create(:membership)
      expect(described_class.call(user: admin, record: membership)).to be_success
      expect(Membership.exists?(membership.id)).to be(false)
    end
  end
end
