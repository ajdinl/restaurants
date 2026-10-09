# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Workspace::Dashboard' do
  let(:restaurant) { create(:restaurant) }

  it 'shows the workspace to members' do
    sign_in create(:membership, :waiter, restaurant:).user
    get workspace_root_path(restaurant)
    expect(response).to have_http_status(:ok)
    expect(response.body).to include(restaurant.name)
  end

  it 'returns 404 to members of other restaurants' do
    sign_in create(:membership, :owner).user
    get workspace_root_path(restaurant)
    expect(response).to have_http_status(:not_found)
  end

  it 'returns 404 to inactive members' do
    sign_in create(:membership, :inactive, restaurant:).user
    get workspace_root_path(restaurant)
    expect(response).to have_http_status(:not_found)
  end

  it 'returns 404 for unknown restaurants' do
    sign_in create(:user, :super_admin)
    get workspace_root_path(restaurant_slug: 'does-not-exist')
    expect(response).to have_http_status(:not_found)
  end

  it 'lets platform staff in for support' do
    sign_in create(:user, :moderator)
    get workspace_root_path(restaurant)
    expect(response).to have_http_status(:ok)
  end

  it 'blocks staff of a suspended restaurant' do
    suspended = create(:restaurant, :suspended)
    sign_in create(:membership, restaurant: suspended).user
    get workspace_root_path(suspended)
    expect(response).to have_http_status(:forbidden)
    expect(response.body).to include(I18n.t('workspace.suspended.title', locale: :bs))
  end

  it 'requires sign in' do
    get workspace_root_path(restaurant)
    expect(response).to redirect_to(new_user_session_path)
  end
end
