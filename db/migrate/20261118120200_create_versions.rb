# frozen_string_literal: true

# PaperTrail history. restaurant_id has no foreign key on purpose: history is read per restaurant
# (activity log) and must not block deleting a restaurant.
class CreateVersions < ActiveRecord::Migration[8.1]
  def change
    create_table :versions, id: :uuid do |t|
      t.string :item_type, null: false
      t.uuid :item_id, null: false
      t.string :event, null: false
      t.string :whodunnit
      t.jsonb :object
      t.jsonb :object_changes
      t.uuid :restaurant_id
      t.jsonb :metadata, null: false, default: {}
      t.datetime :created_at, null: false

      t.index %i[item_type item_id]
      t.index %i[restaurant_id created_at]
    end
  end
end
