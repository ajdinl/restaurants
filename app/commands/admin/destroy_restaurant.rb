# frozen_string_literal: true

module Admin
  class DestroyRestaurant < ApplicationCommand
    publishes 'restaurant.destroyed'

    def call
      destroy_record(record)
    end
  end
end
