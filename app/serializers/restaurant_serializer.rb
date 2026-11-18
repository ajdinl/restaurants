# frozen_string_literal: true

class RestaurantSerializer < ApplicationSerializer
  attributes :name, :slug, :status, :address, :city, :phone, :email, :latitude, :longitude, :time_zone, :has_host, :content_locales, :modules, :created_at
end
