# frozen_string_literal: true

class CreateMemberships < ActiveRecord::Migration[8.1]
  def change
    create_table :memberships, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :restaurant, null: false, foreign_key: true, type: :uuid, index: false
      t.string :role, null: false
      t.boolean :active, null: false, default: true

      t.timestamps

      t.index %i[restaurant_id user_id], unique: true
      t.check_constraint "role IN ('owner', 'manager', 'host', 'waiter', 'kitchen')", name: 'memberships_role_check'
    end
  end
end
