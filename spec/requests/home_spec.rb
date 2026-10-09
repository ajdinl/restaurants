# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Home' do
  it 'sends anonymous visitors to sign in' do
    get root_path
    expect(response).to redirect_to(new_user_session_path)
  end

  it 'sends platform staff to the admin area' do
    sign_in create(:user, :moderator)
    get root_path
    expect(response).to redirect_to(admin_root_path)
  end

  it 'sends a single-restaurant member straight to the workspace' do
    membership = create(:membership)
    sign_in membership.user
    get root_path
    expect(response).to redirect_to(workspace_root_path(membership.restaurant))
  end

  it 'lists restaurants for users who work in several' do
    user = create(:user)
    first = create(:membership, user:).restaurant
    second = create(:membership, user:).restaurant
    sign_in user
    get root_path
    expect(response).to have_http_status(:ok)
    expect(response.body).to include(first.name, second.name)
  end

  it 'explains when the user has no restaurant' do
    sign_in create(:user)
    get root_path
    expect(response.body).to include(I18n.t('home.show.no_access', locale: :bs))
  end
end
