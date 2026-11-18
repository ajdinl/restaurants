# frozen_string_literal: true

module Admin
  class SuspendRestaurant < ApplicationCommand
    publishes 'restaurant.suspended'

    def call
      return failure(I18n.t('commands.admin.suspend_restaurant.already_suspended')) if record.suspended?

      record.status = :suspended
      save_record(record)
    end
  end
end
