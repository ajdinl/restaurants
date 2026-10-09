# frozen_string_literal: true

module Profile
  class UpdateAvatar < ApplicationCommand
    def call
      record.avatar = params[:avatar]
      return success if record.save

      failure(record.errors.errors.dup)
    end
  end
end
