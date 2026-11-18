# frozen_string_literal: true

# Restaurant content in several languages, one jsonb column per attribute (D21):
#   translates :name, required: true
#   translates :description
# stores { "bs" => "Ćevapi", "en" => "Cevapi" }. Allowed languages come from the restaurant's content_locales;
# the first one is primary and must be filled in for required attributes.
module Translatable
  extend ActiveSupport::Concern

  MAX_LENGTH = 2000

  class_methods do
    def translates(*attributes, required: false)
      attributes.each do |attribute|
        define_method(:"#{attribute}_in") { |locale = I18n.locale| translation_for(attribute, locale) }
        validate { validate_translations(attribute, required:) }
      end
    end
  end

  def content_locales
    translation_restaurant&.content_locales.presence || Restaurant::CONTENT_LOCALES
  end

  private

  # Requested locale, then the restaurant's primary one, then any non-blank translation.
  def translation_for(attribute, locale)
    values = (self[attribute] || {}).compact_blank
    values[locale.to_s] || values[content_locales.first] || values.values.first
  end

  def validate_translations(attribute, required:)
    values = self[attribute]
    return errors.add(attribute, :invalid) unless well_formed_translations?(values)
    return errors.add(attribute, :too_long, count: MAX_LENGTH) if values.values.compact.any? { |value| value.length > MAX_LENGTH }

    errors.add(attribute, :blank) if required && values[content_locales.first].blank?
  end

  # A hash of the restaurant's languages to strings (or nil).
  def well_formed_translations?(values)
    values.is_a?(Hash) && (values.keys - content_locales).empty? &&
      values.values.all? { |value| value.nil? || value.is_a?(String) }
  end

  def translation_restaurant
    is_a?(Restaurant) ? self : try(:restaurant)
  end
end
