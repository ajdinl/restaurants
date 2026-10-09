# frozen_string_literal: true

module Admin
  class SuspendRestaurant < ApplicationCommand
    def call
      return failure(I18n.t('commands.admin.suspend_restaurant.already_suspended')) if record.suspended?

      record.suspended!
      success
    end
  end
end
