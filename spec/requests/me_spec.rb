# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Me' do
  let(:user) { create(:user) }

  it 'returns the user with active memberships only' do
    active = create(:membership, user:)
    create(:membership, :inactive, user:)
    get api_v1_me_path, headers: auth_headers_for(user)
    expect(json.dig('data', 'memberships').pluck('id')).to eq([active.id])
    expect(json.dig('data', 'memberships', 0, 'restaurant', 'slug')).to eq(active.restaurant.slug)
  end

  it 'updates name and language' do
    patch api_v1_me_path, params: { user: { full_name: 'Novo Ime', locale: 'en' } }.to_json, headers: auth_headers_for(user)
    expect(response).to have_http_status(:ok)
    expect(user.reload).to have_attributes(full_name: 'Novo Ime', locale: 'en')
  end

  it 'cannot change its own platform role or email' do
    patch api_v1_me_path, params: { user: { platform_role: 'super_admin', email: 'x@example.com', locale: 'en' } }.to_json, headers: auth_headers_for(user)
    expect(user.reload).to have_attributes(platform_role: nil, email: user.email)
  end

  it 'returns validation errors with the field' do
    patch api_v1_me_path, params: { user: { locale: 'xx' } }.to_json, headers: auth_headers_for(user, locale: 'en')
    expect(response).to have_http_status(:unprocessable_content)
    expect(json['errors'].first['field']).to eq('locale')
  end

  it 'localizes errors from Accept-Language, mapping Croatian to Bosnian' do
    get api_v1_admin_dashboard_path, headers: auth_headers_for(user, locale: 'hr-HR')
    expect(error_messages).to eq([I18n.t('errors.not_found', locale: :bs)])
  end
end
