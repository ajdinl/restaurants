# frozen_string_literal: true

# Outbox of domain events (D36). Commands write here in the same transaction as the change; a job
# dispatches each event after commit. Not tenant-scoped: platform events have no restaurant, and the
# dispatcher reads across restaurants.
class CreateDomainEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :domain_events, id: :uuid do |t|
      t.references :restaurant, type: :uuid, foreign_key: { on_delete: :cascade }, index: false
      t.string :name, null: false
      t.string :subject_type
      t.uuid :subject_id
      t.uuid :actor_id
      t.jsonb :payload, null: false, default: {}
      t.datetime :occurred_at, null: false
      t.datetime :dispatched_at
      t.timestamps

      t.index %i[restaurant_id occurred_at]
      t.index %i[subject_type subject_id]
      t.index :occurred_at, where: 'dispatched_at IS NULL', name: 'index_domain_events_undispatched'
      t.check_constraint "name ~ '^[a-z_]+(\\.[a-z_]+)+$'", name: 'domain_events_name_check'
    end
  end
end
