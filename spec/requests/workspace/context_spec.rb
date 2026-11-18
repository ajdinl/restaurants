# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Workspace context API' do
  let(:restaurant) { create(:restaurant, modules: %w[qr_menu table_service]) }

  def context_for_user(user)
    get api_v1_workspace_context_path(restaurant), headers: auth_headers_for(user)
    json['data']
  end

  it 'returns the restaurant, membership, modules and abilities' do
    membership = create(:membership, :manager, restaurant:)
    data = context_for_user(membership.user)
    expect(response).to have_http_status(:ok)
    expect(data).to include('membership' => { 'id' => membership.id, 'role' => 'manager' }, 'support_view' => false,
                            'modules' => %w[qr_menu table_service])
    expect(data.dig('restaurant', 'slug')).to eq(restaurant.slug)
    expect(data['abilities'].keys).to match_array(Workspace::Abilities::MAP.keys)
  end

  it 'gives a waiter read-only abilities' do
    abilities = context_for_user(create(:membership, :waiter, restaurant:).user)['abilities']
    expect(abilities.select { |_key, allowed| allowed }.keys).to contain_exactly('settings.view', 'menu.view', 'floor.view')
  end

  it 'lets kitchen staff mark items sold out' do
    abilities = context_for_user(create(:membership, :kitchen, restaurant:).user)['abilities']
    expect(abilities).to include('menu.availability' => true, 'menu.manage' => false)
  end

  it 'gives an owner every ability' do
    abilities = context_for_user(create(:membership, :owner, restaurant:).user)['abilities']
    expect(abilities.values).to all(be(true))
  end

  it 'gives a moderator a read-only support view' do
    data = context_for_user(create(:user, :moderator))
    expect(data).to include('membership' => nil, 'support_view' => true)
    expect(data['abilities'].select { |_key, allowed| allowed }.keys)
      .to contain_exactly('settings.view', 'staff.view', 'menu.view', 'floor.view', 'activity.view')
  end

  it 'returns 404 to outsiders' do
    get api_v1_workspace_context_path(restaurant), headers: auth_headers_for(create(:membership, :owner).user)
    expect(response).to have_http_status(:not_found)
  end

  it 'returns 403 to staff of a suspended restaurant' do
    suspended = create(:restaurant, :suspended)
    get api_v1_workspace_context_path(suspended), headers: auth_headers_for(create(:membership, restaurant: suspended).user)
    expect(response).to have_http_status(:forbidden)
  end
end
