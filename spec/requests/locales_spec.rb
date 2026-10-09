# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Locales' do
  it 'defaults to Bosnian' do
    get new_user_session_path
    expect(response.body).to include('lang="bs"')
  end

  it 'uses the browser language when supported' do
    get new_user_session_path, headers: { 'Accept-Language' => 'en-US,en;q=0.9' }
    expect(response.body).to include('lang="en"')
  end

  it 'treats Croatian browsers as Bosnian' do
    get new_user_session_path, headers: { 'Accept-Language' => 'hr-HR' }
    expect(response.body).to include('lang="bs"')
  end

  it 'switches language and saves it on the user' do
    user = create(:user)
    sign_in user
    patch locale_path(locale: 'en')
    expect(user.reload.locale).to eq('en')
    get new_user_session_path
    expect(response).to redirect_to(root_path)
  end

  it 'ignores unsupported locales' do
    patch locale_path(locale: 'xx')
    get new_user_session_path
    expect(response.body).to include('lang="bs"')
  end
end
