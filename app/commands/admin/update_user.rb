# frozen_string_literal: true

module Admin
  class UpdateUser < ApplicationCommand
    include SimpleUpdate

    publishes 'user.updated'
  end
end
