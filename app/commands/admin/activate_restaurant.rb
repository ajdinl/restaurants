# frozen_string_literal: true

module Admin
  class ActivateRestaurant < ApplicationCommand
    def call
      return failure(I18n.t('commands.admin.activate_restaurant.already_active')) if record.active?

      record.active!
      success
    end
  end
end
