# frozen_string_literal: true

module Admin
  class ActivateRestaurant < ApplicationCommand
    publishes 'restaurant.activated'

    def call
      return failure(I18n.t('commands.admin.activate_restaurant.already_active')) if record.active?

      record.status = :active
      save_record(record)
    end
  end
end
