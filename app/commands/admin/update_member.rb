# frozen_string_literal: true

module Admin
  class UpdateMember < ApplicationCommand
    include SimpleUpdate

    publishes 'membership.updated'
  end
end
