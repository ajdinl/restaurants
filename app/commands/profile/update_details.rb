# frozen_string_literal: true

module Profile
  # A user editing their own name and language.
  class UpdateDetails < ApplicationCommand
    include SimpleUpdate

    publishes 'user.profile_updated'
  end
end
