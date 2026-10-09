# frozen_string_literal: true

class LocalesController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  def update
    locale = params[:locale].to_s
    if locale_available?(locale)
      session[:locale] = locale
      current_user&.update!(locale:)
    end

    redirect_back_or_to root_path
  end
end
