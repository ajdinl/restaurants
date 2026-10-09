# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Admin::Memberships' do
  let(:restaurant) { create(:restaurant) }

  before { sign_in create(:user, :moderator) }

  it 'adds staff by email' do
    member = create(:user)
    post admin_restaurant_memberships_path(restaurant), params: { membership: { email: member.email, role: 'host' } }
    expect(restaurant.memberships.find_by(user: member)).to be_host
  end

  it 'cannot touch a membership through another restaurant' do
    foreign = create(:membership)
    patch admin_restaurant_membership_path(restaurant, foreign), params: { membership: { role: 'owner' } }
    expect(response).to have_http_status(:not_found)
    expect(foreign.reload).to be_waiter
  end

  it 'removes staff' do
    membership = create(:membership, restaurant:)
    delete admin_restaurant_membership_path(restaurant, membership)
    expect(Membership.exists?(membership.id)).to be(false)
  end
end
