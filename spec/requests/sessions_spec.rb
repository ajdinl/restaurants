# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Auth sessions' do
  let(:user) { create(:user, password: 'password123') }
  let(:headers) { { 'Accept' => 'application/json', 'Accept-Language' => 'en' } }

  def sign_in_with(password)
    post user_session_path, params: { user: { email: user.email, password: } }, headers:, as: :json
  end

  it 'returns a JWT and the current user' do
    sign_in_with('password123')
    expect(response).to have_http_status(:ok)
    expect(response.headers['Authorization']).to start_with('Bearer ')
    expect(json.dig('data', 'email')).to eq(user.email)
  end

  it 'rejects a wrong password without revealing whether the account exists' do
    sign_in_with('wrong-password')
    expect(response).to have_http_status(:unauthorized)
    expect(error_messages).to eq(['Invalid email or password.'])
  end

  it 'counts a sign-in but not later authenticated requests' do
    sign_in_with('password123')
    token = response.headers['Authorization']
    get api_v1_me_path, headers: headers.merge('Authorization' => token)
    expect(user.reload.sign_in_count).to eq(1)
  end

  it 'locks the account after too many failed attempts' do
    Devise.maximum_attempts.times { sign_in_with('wrong-password') }
    expect(user.reload).to be_access_locked
  end

  it 'revokes the token on sign out' do
    sign_in_with('password123')
    token = response.headers['Authorization']
    delete destroy_user_session_path, headers: headers.merge('Authorization' => token)
    expect(response).to have_http_status(:no_content)

    get api_v1_me_path, headers: headers.merge('Authorization' => token)
    expect(response).to have_http_status(:unauthorized)
  end

  it 'rejects requests without a token' do
    get api_v1_me_path, headers: headers
    expect(response).to have_http_status(:unauthorized)
    expect(json['errors']).to be_present
  end

  it 'answers Bosnian by default' do
    get api_v1_me_path, headers: { 'Accept' => 'application/json' }
    expect(error_messages.first).to include('prijavi')
  end
end
