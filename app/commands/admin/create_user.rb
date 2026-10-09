# frozen_string_literal: true

module Admin
  class CreateUser < ApplicationCommand
    include SimpleCreate

    creates User
  end
end
