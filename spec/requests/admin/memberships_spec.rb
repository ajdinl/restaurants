# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Admin memberships API' do
  let(:restaurant) { create(:restaurant) }
  let(:headers) { auth_headers_for(create(:user, :moderator), locale: 'en') }

  it 'lists the restaurant staff only' do
    mine = create(:membership, restaurant:)
    create(:membership)
    get api_v1_admin_restaurant_memberships_path(restaurant), headers: headers
    expect(json['data'].pluck('id')).to eq([mine.id])
    expect(json['data'].first['user']).to include('email' => mine.user.email)
  end

  it 'adds staff by email' do
    member = create(:user)
    post api_v1_admin_restaurant_memberships_path(restaurant), params: { membership: { email: member.email, role: 'host' } }.to_json, headers: headers
    expect(response).to have_http_status(:created)
    expect(restaurant.memberships.find_by(user: member)).to be_host
  end

  it 'explains when the email is unknown' do
    post api_v1_admin_restaurant_memberships_path(restaurant), params: { membership: { email: 'nobody@example.com', role: 'host' } }.to_json, headers: headers
    expect(response).to have_http_status(:unprocessable_content)
    expect(error_messages).to eq([I18n.t('commands.admin.add_member.user_not_found', locale: :en)])
  end

  it 'cannot touch a membership through another restaurant' do
    foreign = create(:membership)
    patch api_v1_admin_restaurant_membership_path(restaurant, foreign), params: { membership: { role: 'owner' } }.to_json, headers: headers
    expect(response).to have_http_status(:not_found)
    expect(foreign.reload).to be_waiter
  end

  it 'updates and removes staff' do
    membership = create(:membership, restaurant:)
    patch api_v1_admin_restaurant_membership_path(restaurant, membership), params: { membership: { role: 'host', active: false } }.to_json, headers: headers
    expect(json['data']).to include('role' => 'host', 'active' => false)

    delete api_v1_admin_restaurant_membership_path(restaurant, membership), headers: headers
    expect(response).to have_http_status(:no_content)
    expect(Membership.exists?(membership.id)).to be(false)
  end
end
