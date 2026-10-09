# frozen_string_literal: true

# Picks the response language: Accept-Language (sent by the frontend) > user's preference > default (bs).
module LocaleResolver
  # Croatian and Serbian browsers read Bosnian without trouble.
  ALIASES = { 'hr' => 'bs', 'sr' => 'bs', 'sh' => 'bs' }.freeze

  module_function

  def resolve(accept_language, user_locale = nil)
    [from_header(accept_language), user_locale].find { |locale| available?(locale) } || I18n.default_locale
  end

  def from_header(accept_language)
    codes = accept_language.to_s.split(',').map do |part|
      code = part.split(';').first.to_s.strip.split('-').first.to_s.downcase
      ALIASES.fetch(code, code)
    end
    codes.find { |code| available?(code) }
  end

  def available?(locale)
    locale.present? && I18n.available_locales.map(&:to_s).include?(locale.to_s)
  end
end
