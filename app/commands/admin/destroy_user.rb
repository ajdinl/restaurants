# frozen_string_literal: true

module Admin
  class DestroyUser < ApplicationCommand
    publishes 'user.destroyed'

    def call
      destroy_record(record)
    end
  end
end
