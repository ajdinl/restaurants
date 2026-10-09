# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Workspace dashboard API' do
  let(:restaurant) { create(:restaurant) }

  it 'shows the workspace to members with their role' do
    waiter = create(:membership, :waiter, restaurant:).user
    get api_v1_workspace_dashboard_path(restaurant), headers: auth_headers_for(waiter)
    expect(response).to have_http_status(:ok)
    expect(json['data']).to include('role' => 'waiter', 'support_view' => false)
    expect(json.dig('data', 'restaurant', 'slug')).to eq(restaurant.slug)
  end

  it 'returns 404 to members of other restaurants' do
    get api_v1_workspace_dashboard_path(restaurant), headers: auth_headers_for(create(:membership, :owner).user)
    expect(response).to have_http_status(:not_found)
  end

  it 'returns 404 to inactive members' do
    get api_v1_workspace_dashboard_path(restaurant), headers: auth_headers_for(create(:membership, :inactive, restaurant:).user)
    expect(response).to have_http_status(:not_found)
  end

  it 'returns 404 for unknown restaurants' do
    get api_v1_workspace_dashboard_path('does-not-exist'), headers: auth_headers_for(create(:user, :super_admin))
    expect(response).to have_http_status(:not_found)
  end

  it 'lets platform staff in as a support view' do
    get api_v1_workspace_dashboard_path(restaurant), headers: auth_headers_for(create(:user, :moderator))
    expect(json['data']).to include('role' => nil, 'support_view' => true)
  end

  it 'blocks staff of a suspended restaurant' do
    suspended = create(:restaurant, :suspended)
    get api_v1_workspace_dashboard_path(suspended), headers: auth_headers_for(create(:membership, restaurant: suspended).user)
    expect(response).to have_http_status(:forbidden)
    expect(error_messages).to eq([I18n.t('errors.restaurant_suspended', locale: :bs)])
  end
end
