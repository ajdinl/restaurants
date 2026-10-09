# frozen_string_literal: true

module Profile
  class RemoveAvatar < ApplicationCommand
    def call
      record.avatar.purge_later if record.avatar.attached?
      success
    end
  end
end
