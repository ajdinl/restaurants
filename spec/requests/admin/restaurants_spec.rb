# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Admin::Restaurants' do
  let(:restaurant) { create(:restaurant) }

  context 'as a restaurant owner' do
    before { sign_in create(:membership, :owner, restaurant:).user }

    it 'hides the admin area with 404' do
      get admin_restaurants_path
      expect(response).to have_http_status(:not_found)
    end

    it 'cannot delete restaurants' do
      delete admin_restaurant_path(restaurant)
      expect(response).to have_http_status(:not_found)
      expect(Restaurant.exists?(restaurant.id)).to be(true)
    end
  end

  context 'as a moderator' do
    before { sign_in create(:user, :moderator) }

    it 'lists restaurants' do
      restaurant
      get admin_restaurants_path
      expect(response.body).to include(restaurant.name)
    end

    it 'creates a restaurant' do
      expect do
        post admin_restaurants_path, params: { restaurant: { name: 'Nova Kafana', city: 'Zenica' } }
      end.to change(Restaurant, :count).by(1)
      expect(response).to redirect_to(admin_restaurant_path(Restaurant.find_by!(slug: 'nova-kafana')))
    end

    it 're-renders the form on invalid input' do
      post admin_restaurants_path, params: { restaurant: { name: '' } }
      expect(response).to have_http_status(:unprocessable_content)
    end

    it 'suspends a restaurant' do
      patch suspend_admin_restaurant_path(restaurant)
      expect(restaurant.reload).to be_suspended
    end

    it 'cannot delete a restaurant' do
      delete admin_restaurant_path(restaurant)
      expect(response).to have_http_status(:forbidden)
      expect(Restaurant.exists?(restaurant.id)).to be(true)
    end

    it 'ignores non-permitted attributes such as status' do
      patch admin_restaurant_path(restaurant), params: { restaurant: { name: 'Novo', status: 'suspended' } }
      expect(restaurant.reload).to have_attributes(name: 'Novo', status: 'active')
    end
  end

  context 'as a super admin' do
    before { sign_in create(:user, :super_admin) }

    it 'deletes a restaurant' do
      delete admin_restaurant_path(restaurant)
      expect(response).to redirect_to(admin_restaurants_path)
      expect(Restaurant.exists?(restaurant.id)).to be(false)
    end
  end

  it 'requires sign in' do
    get admin_restaurants_path
    expect(response).to redirect_to(new_user_session_path)
  end
end
