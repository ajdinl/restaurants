# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Admin::Users' do
  let(:valid_params) { { full_name: 'Novi Konobar', email: 'novi@example.com', password: 'password123' } }

  context 'as a moderator' do
    before { sign_in create(:user, :moderator) }

    it 'creates staff accounts' do
      expect { post admin_users_path, params: { user: valid_params } }.to change(User, :count).by(1)
    end

    it 'cannot grant platform roles' do
      post admin_users_path, params: { user: valid_params.merge(platform_role: 'super_admin') }
      expect(User.find_by!(email: 'novi@example.com').platform_role).to be_nil
    end

    it 'cannot edit a super admin' do
      admin = create(:user, :super_admin)
      patch admin_user_path(admin), params: { user: { full_name: 'Hacked' } }
      expect(response).to have_http_status(:forbidden)
      expect(admin.reload.full_name).not_to eq('Hacked')
    end

    it 'cannot change passwords through update' do
      account = create(:user)
      old_password = account.encrypted_password
      patch admin_user_path(account), params: { user: { password: 'newpassword123' } }
      expect(account.reload.encrypted_password).to eq(old_password)
    end
  end

  context 'as a super admin' do
    before { sign_in create(:user, :super_admin) }

    it 'grants platform roles' do
      post admin_users_path, params: { user: valid_params.merge(platform_role: 'moderator') }
      expect(User.find_by!(email: 'novi@example.com')).to be_moderator
    end
  end
end
