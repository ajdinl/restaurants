# frozen_string_literal: true

module Profile
  class UpdateAvatar < ApplicationCommand
    publishes 'user.avatar_updated'

    def call
      record.avatar = params[:avatar]
      save_record(record)
    end
  end
end
