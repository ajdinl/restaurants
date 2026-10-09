# frozen_string_literal: true

# Locale priority: explicit choice this session > user's saved preference > browser > default (bs).
module Localization
  extend ActiveSupport::Concern

  # Croatian and Serbian browsers read Bosnian without trouble.
  LOCALE_ALIASES = { 'hr' => 'bs', 'sr' => 'bs', 'sh' => 'bs' }.freeze

  included do
    around_action :switch_locale
  end

  private

  def switch_locale(&)
    I18n.with_locale(current_locale, &)
  end

  def current_locale
    [session[:locale], current_user&.locale, locale_from_header].find { |locale| locale_available?(locale) } || I18n.default_locale
  end

  def locale_from_header
    codes = request.headers['Accept-Language'].to_s.split(',').map do |part|
      code = part.split(';').first.to_s.strip.split('-').first.to_s.downcase
      LOCALE_ALIASES.fetch(code, code)
    end
    codes.find { |code| locale_available?(code) }
  end

  def locale_available?(locale)
    locale.present? && I18n.available_locales.map(&:to_s).include?(locale.to_s)
  end
end
