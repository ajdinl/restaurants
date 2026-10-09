# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Admin restaurants API' do
  let(:restaurant) { create(:restaurant) }
  let(:moderator) { create(:user, :moderator) }
  let(:super_admin) { create(:user, :super_admin) }

  context 'as a restaurant owner' do
    let(:owner) { create(:membership, :owner, restaurant:).user }

    it 'hides the admin API with 404' do
      get api_v1_admin_restaurants_path, headers: auth_headers_for(owner)
      expect(response).to have_http_status(:not_found)
    end

    it 'cannot delete restaurants' do
      delete api_v1_admin_restaurant_path(restaurant), headers: auth_headers_for(owner)
      expect(response).to have_http_status(:not_found)
      expect(Restaurant.exists?(restaurant.id)).to be(true)
    end
  end

  context 'as a moderator' do
    let(:headers) { auth_headers_for(moderator, locale: 'en') }

    it 'lists restaurants with pagination meta' do
      create_list(:restaurant, 3)
      get api_v1_admin_restaurants_path, params: { per_page: 2 }, headers: headers
      expect(json['data'].size).to eq(2)
      expect(json['meta']).to include('page' => 1, 'per_page' => 2, 'total' => 3, 'total_pages' => 2)
    end

    it 'shows a restaurant by slug' do
      get api_v1_admin_restaurant_path(restaurant), headers: headers
      expect(json.dig('data', 'slug')).to eq(restaurant.slug)
    end

    it 'returns 404 for an unknown slug' do
      get api_v1_admin_restaurant_path('nope'), headers: headers
      expect(response).to have_http_status(:not_found)
    end

    it 'creates a restaurant' do
      post api_v1_admin_restaurants_path, params: { restaurant: { name: 'Nova Kafana', city: 'Zenica' } }.to_json, headers: headers
      expect(response).to have_http_status(:created)
      expect(json.dig('data', 'slug')).to eq('nova-kafana')
    end

    it 'returns field errors on invalid input' do
      post api_v1_admin_restaurants_path, params: { restaurant: { name: '' } }.to_json, headers: headers
      expect(response).to have_http_status(:unprocessable_content)
      expect(json['errors']).to include(a_hash_including('field' => 'name'))
    end

    it 'returns 400 when no restaurant attributes are sent' do
      post api_v1_admin_restaurants_path, params: {}.to_json, headers: headers
      expect(response).to have_http_status(:bad_request)
    end

    it 'suspends and activates a restaurant' do
      patch suspend_api_v1_admin_restaurant_path(restaurant), headers: headers
      expect(json.dig('data', 'status')).to eq('suspended')
      patch activate_api_v1_admin_restaurant_path(restaurant), headers: headers
      expect(json.dig('data', 'status')).to eq('active')
    end

    it 'is forbidden to suspend an already suspended restaurant' do
      restaurant.suspended!
      patch suspend_api_v1_admin_restaurant_path(restaurant), headers: headers
      expect(response).to have_http_status(:forbidden)
    end

    it 'cannot delete a restaurant' do
      delete api_v1_admin_restaurant_path(restaurant), headers: headers
      expect(response).to have_http_status(:forbidden)
      expect(Restaurant.exists?(restaurant.id)).to be(true)
    end

    it 'ignores non-permitted attributes such as status' do
      patch api_v1_admin_restaurant_path(restaurant), params: { restaurant: { name: 'Novo', status: 'suspended' } }.to_json, headers: headers
      expect(restaurant.reload).to have_attributes(name: 'Novo', status: 'active')
    end
  end

  context 'as a super admin' do
    it 'deletes a restaurant' do
      delete api_v1_admin_restaurant_path(restaurant), headers: auth_headers_for(super_admin)
      expect(response).to have_http_status(:no_content)
      expect(Restaurant.exists?(restaurant.id)).to be(false)
    end

    it 'shows dashboard counts' do
      restaurant
      create(:restaurant, :suspended)
      get api_v1_admin_dashboard_path, headers: auth_headers_for(super_admin)
      expect(json.dig('data', 'restaurants')).to eq('total' => 2, 'active' => 1, 'suspended' => 1)
    end
  end

  it 'requires authentication' do
    get api_v1_admin_restaurants_path, headers: { 'Accept' => 'application/json' }
    expect(response).to have_http_status(:unauthorized)
  end
end
