# frozen_string_literal: true

module ApplicationHelper
  # enum_label(Membership, :role, 'waiter') => "Konobar" (activerecord.attributes.membership.roles.waiter)
  def enum_label(model_class, attribute, value)
    return if value.blank?

    t("activerecord.attributes.#{model_class.model_name.i18n_key}.#{attribute.to_s.pluralize}.#{value}")
  end

  def enum_options(model_class, attribute)
    model_class.public_send(attribute.to_s.pluralize).keys.map { |value| [enum_label(model_class, attribute, value), value] }
  end

  def status_badge(restaurant)
    css = restaurant.active? ? 'badge badge-green' : 'badge badge-red'
    tag.span(enum_label(Restaurant, :status, restaurant.status), class: css)
  end
end
