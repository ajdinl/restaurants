# frozen_string_literal: true

module Admin
  class RemoveMember < ApplicationCommand
    publishes 'membership.removed'

    def call
      destroy_record(record)
    end
  end
end
