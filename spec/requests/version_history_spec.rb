# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Change history' do
  let(:super_admin) { create(:user, :super_admin) }
  let(:restaurant) { create(:restaurant) }

  it 'records who changed a restaurant, for which restaurant, and from where' do
    patch api_v1_admin_restaurant_path(restaurant), params: { restaurant: { phone: '033 123 456' } }.to_json,
                                                    headers: auth_headers_for(super_admin).merge('X-Request-Id' => 'req-1')
    expect(response).to have_http_status(:ok)
    version = restaurant.versions.last
    expect(version).to have_attributes(event: 'update', whodunnit: super_admin.id, restaurant_id: restaurant.id)
    expect(version.metadata).to include('ip' => '127.0.0.1', 'request_id' => 'req-1')
  end

  it 'tags membership changes with the membership restaurant' do
    membership = create(:membership, :waiter, restaurant:)
    patch api_v1_admin_restaurant_membership_path(restaurant, membership), params: { membership: { role: 'host' } }.to_json,
                                                                           headers: auth_headers_for(super_admin)
    expect(membership.versions.last).to have_attributes(whodunnit: super_admin.id, restaurant_id: restaurant.id)
    expect(membership.versions.last.object_changes).to include('role' => %w[waiter host])
  end
end
