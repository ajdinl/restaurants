# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Admin users API' do
  let(:valid_params) { { full_name: 'Novi Konobar', email: 'novi@example.com', password: 'password123' } }

  context 'as a moderator' do
    let(:headers) { auth_headers_for(create(:user, :moderator), locale: 'en') }

    it 'creates staff accounts without exposing secrets' do
      post api_v1_admin_users_path, params: { user: valid_params }.to_json, headers: headers
      expect(response).to have_http_status(:created)
      expect(json['data'].keys).not_to include('encrypted_password', 'jti', 'reset_password_token')
    end

    it 'cannot grant platform roles' do
      post api_v1_admin_users_path, params: { user: valid_params.merge(platform_role: 'super_admin') }.to_json, headers: headers
      expect(User.find_by!(email: 'novi@example.com').platform_role).to be_nil
    end

    it 'cannot edit a super admin' do
      admin = create(:user, :super_admin)
      patch api_v1_admin_user_path(admin), params: { user: { full_name: 'Hacked' } }.to_json, headers: headers
      expect(response).to have_http_status(:forbidden)
      expect(admin.reload.full_name).not_to eq('Hacked')
    end

    it 'cannot change passwords through update' do
      account = create(:user)
      expect do
        patch api_v1_admin_user_path(account), params: { user: { password: 'newpassword123' } }.to_json, headers: headers
      end.not_to(change { account.reload.encrypted_password })
    end

    it 'cannot delete users' do
      delete api_v1_admin_user_path(create(:user)), headers: headers
      expect(response).to have_http_status(:forbidden)
    end

    it 'returns 404 for a malformed id' do
      get api_v1_admin_user_path('not-a-uuid'), headers: headers
      expect(response).to have_http_status(:not_found)
    end
  end

  context 'as a super admin' do
    let(:super_admin) { create(:user, :super_admin) }
    let(:headers) { auth_headers_for(super_admin) }

    it 'grants platform roles' do
      post api_v1_admin_users_path, params: { user: valid_params.merge(platform_role: 'moderator') }.to_json, headers: headers
      expect(User.find_by!(email: 'novi@example.com')).to be_moderator
    end

    it 'cannot demote itself' do
      patch api_v1_admin_user_path(super_admin), params: { user: { platform_role: '' } }.to_json, headers: headers
      expect(super_admin.reload).to be_super_admin
    end

    it 'cannot delete itself' do
      delete api_v1_admin_user_path(super_admin), headers: headers
      expect(response).to have_http_status(:forbidden)
    end

    it 'lists users with pagination meta' do
      get api_v1_admin_users_path, headers: headers
      expect(json['meta']['total']).to eq(1)
    end
  end
end
