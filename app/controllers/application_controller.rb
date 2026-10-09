# frozen_string_literal: true

class ApplicationController < ActionController::API
  include AbstractController::Translation
  include Localization
  include ErrorHandler
  include ResponseHelpers
end
