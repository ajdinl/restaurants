# frozen_string_literal: true

class AddModulesAndContentLocalesToRestaurants < ActiveRecord::Migration[8.1]
  MODULE_KEYS = %w[qr_menu table_service ordering billing fiscal reservations public_page reviews recipes inventory
                   purchasing scheduling haccp finance guests loyalty online_orders].freeze

  def change
    change_table :restaurants, bulk: true do |t|
      t.string :modules, array: true, null: false, default: []
      t.string :content_locales, array: true, null: false, default: %w[bs en]
    end

    # A handful of rows, so validating the constraints inline is instant.
    safety_assured do
      add_check_constraint :restaurants, "modules <@ ARRAY[#{MODULE_KEYS.map { |k| "'#{k}'" }.join(', ')}]::varchar[]",
                           name: 'restaurants_modules_check'
      add_check_constraint :restaurants, "content_locales <@ ARRAY['bs', 'en']::varchar[] AND cardinality(content_locales) >= 1",
                           name: 'restaurants_content_locales_check'
    end
  end
end
