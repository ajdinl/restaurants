# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Auth passwords' do
  let(:headers) { { 'Accept' => 'application/json', 'Accept-Language' => 'en' } }
  let(:user) { create(:user) }

  it 'gives the same answer for known and unknown emails' do
    post user_password_path, params: { user: { email: user.email } }, headers:, as: :json
    known = [response.status, json]
    post user_password_path, params: { user: { email: 'nobody@example.com' } }, headers:, as: :json
    expect([response.status, json]).to eq(known)
    expect(response).to have_http_status(:accepted)
  end

  it 'emails a reset link that points to the frontend' do
    expect { post user_password_path, params: { user: { email: user.email } }, headers:, as: :json }
      .to change(ActionMailer::Base.deliveries, :count).by(1)
    expect(ActionMailer::Base.deliveries.last.body.encoded).to include('http://localhost:3000/reset-password?token=')
  end

  it 'resets the password with a valid token and signs out other sessions' do
    token = user.send_reset_password_instructions
    old_jti = user.reload.jti
    put user_password_path, params: { user: { reset_password_token: token, password: 'brand-new-password', password_confirmation: 'brand-new-password' } },
                            headers:, as: :json
    expect(response).to have_http_status(:ok)
    expect(user.reload).to be_valid_password('brand-new-password')
    expect(user.jti).not_to eq(old_jti)
  end

  it 'rejects an invalid token' do
    put user_password_path, params: { user: { reset_password_token: 'bogus', password: 'brand-new-password', password_confirmation: 'brand-new-password' } },
                            headers:, as: :json
    expect(response).to have_http_status(:unprocessable_content)
    expect(json['errors'].first['field']).to eq('reset_password_token')
  end
end
