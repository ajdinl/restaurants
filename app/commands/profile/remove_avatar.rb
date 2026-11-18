# frozen_string_literal: true

module Profile
  class RemoveAvatar < ApplicationCommand
    publishes 'user.avatar_removed'

    def call
      return success unless record.avatar.attached?

      transaction do
        record.avatar.purge_later
        publish(subject: record)
      end
      success
    end
  end
end
