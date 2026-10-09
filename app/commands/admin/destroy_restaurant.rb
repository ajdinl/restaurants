# frozen_string_literal: true

module Admin
  class DestroyRestaurant < ApplicationCommand
    def call
      record.destroy ? success : failure(record.errors.full_messages)
    end
  end
end
