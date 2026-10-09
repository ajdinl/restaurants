# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Me password' do
  let(:user) { create(:user, password: 'old-password-1') }
  let(:headers) { auth_headers_for(user, locale: 'en') }

  def change(params)
    patch api_v1_me_password_path, params: { user: params }.to_json, headers: headers
  end

  it 'changes the password and returns a fresh token for this device' do
    change(current_password: 'old-password-1', password: 'new-password-1', password_confirmation: 'new-password-1')
    expect(response).to have_http_status(:no_content)
    expect(user.reload).to be_valid_password('new-password-1')

    fresh = response.headers['Authorization']
    get api_v1_me_path, headers: headers.merge('Authorization' => fresh)
    expect(response).to have_http_status(:ok)
  end

  it 'signs out other sessions' do
    change(current_password: 'old-password-1', password: 'new-password-1', password_confirmation: 'new-password-1')
    get api_v1_me_path, headers: headers
    expect(response).to have_http_status(:unauthorized)
  end

  it 'requires the current password' do
    change(current_password: 'wrong', password: 'new-password-1', password_confirmation: 'new-password-1')
    expect(response).to have_http_status(:unprocessable_content)
    expect(json['errors']).to include(a_hash_including('field' => 'current_password'))
    expect(user.reload).to be_valid_password('old-password-1')
  end

  it 'rejects a blank new password' do
    change(current_password: 'old-password-1', password: '', password_confirmation: '')
    expect(response).to have_http_status(:unprocessable_content)
    expect(json['errors']).to include(a_hash_including('field' => 'password'))
  end

  it 'rejects a mismatched confirmation' do
    change(current_password: 'old-password-1', password: 'new-password-1', password_confirmation: 'different-1')
    expect(response).to have_http_status(:unprocessable_content)
    expect(json['errors']).to include(a_hash_including('field' => 'password_confirmation'))
  end

  it 'rejects a short password' do
    change(current_password: 'old-password-1', password: 'short', password_confirmation: 'short')
    expect(json['errors']).to include(a_hash_including('field' => 'password'))
  end
end
