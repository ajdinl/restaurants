# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Rate limiting' do
  around do |example|
    store = Rack::Attack.cache.store
    Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new
    example.run
  ensure
    Rack::Attack.cache.store = store
  end

  it 'throttles repeated sign-in attempts for one email across IPs' do
    user = create(:user)
    statuses = 11.times.map do |i|
      post user_session_path, params: { user: { email: user.email, password: 'wrong-password' } },
                              headers: { 'Accept' => 'application/json', 'REMOTE_ADDR' => "10.0.0.#{i}" }, as: :json
      response.status
    end
    expect(statuses.last).to eq(429)
    expect(json['errors']).to be_present
  end
end
