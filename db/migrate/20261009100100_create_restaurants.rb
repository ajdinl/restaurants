# frozen_string_literal: true

class CreateRestaurants < ActiveRecord::Migration[8.1]
  def change
    create_table :restaurants, id: :uuid do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.string :status, null: false, default: 'active'
      t.string :address
      t.string :city
      t.string :phone
      t.string :email
      t.decimal :latitude, precision: 9, scale: 6
      t.decimal :longitude, precision: 9, scale: 6
      t.string :time_zone, null: false, default: 'Europe/Sarajevo'
      t.boolean :has_host, null: false, default: false

      t.timestamps

      t.index :slug, unique: true
      t.index :status
      t.check_constraint "status IN ('active', 'suspended')", name: 'restaurants_status_check'
      t.check_constraint 'latitude BETWEEN -90 AND 90', name: 'restaurants_latitude_check'
      t.check_constraint 'longitude BETWEEN -180 AND 180', name: 'restaurants_longitude_check'
    end
  end
end
