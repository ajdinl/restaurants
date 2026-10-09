# frozen_string_literal: true

module Admin
  class CreateRestaurant < ApplicationCommand
    include SimpleCreate

    creates Restaurant
  end
end
