# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Sessions' do
  let(:user) { create(:user, password: 'password123') }

  it 'signs in with valid credentials' do
    post user_session_path, params: { user: { email: user.email, password: 'password123' } }
    expect(response).to redirect_to(root_path)
  end

  it 'locks the account after too many failed attempts' do
    Devise.maximum_attempts.times do
      post user_session_path, params: { user: { email: user.email, password: 'wrong-password' } }
    end
    expect(user.reload).to be_access_locked
  end

  it 'does not reveal whether an email exists on password reset' do
    post user_password_path, params: { user: { email: 'nobody@example.com' } }
    expect(response).to redirect_to(new_user_session_path)
  end
end
