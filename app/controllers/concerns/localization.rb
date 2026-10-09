# frozen_string_literal: true

module Localization
  extend ActiveSupport::Concern

  included do
    around_action :switch_locale
  end

  private

  def switch_locale(&)
    I18n.with_locale(LocaleResolver.resolve(request.headers['Accept-Language'], current_user&.locale), &)
  end
end
