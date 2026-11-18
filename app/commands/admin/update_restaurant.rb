# frozen_string_literal: true

module Admin
  class UpdateRestaurant < ApplicationCommand
    include SimpleUpdate

    publishes 'restaurant.updated'
  end
end
