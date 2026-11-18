# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_11_18_120300) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pg_trgm"
  enable_extension "unaccent"


  create_function :f_unaccent, sql_definition: <<-'SQL'
      CREATE OR REPLACE FUNCTION public.f_unaccent(text)
       RETURNS text
       LANGUAGE sql
       IMMUTABLE PARALLEL SAFE STRICT
      AS $function$
        SELECT public.unaccent('public.unaccent'::regdictionary, $1)
      $function$
  SQL
  create_table "active_storage_attachments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.uuid "record_id", null: false
    t.uuid "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "domain_events", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "restaurant_id"
    t.string "name", null: false
    t.string "subject_type"
    t.uuid "subject_id"
    t.uuid "actor_id"
    t.jsonb "payload", default: {}, null: false
    t.datetime "occurred_at", null: false
    t.datetime "dispatched_at"
    t.index ["occurred_at"], name: "index_domain_events_undispatched", where: "(dispatched_at IS NULL)"
    t.index ["restaurant_id", "occurred_at"], name: "index_domain_events_on_restaurant_id_and_occurred_at"
    t.index ["subject_type", "subject_id"], name: "index_domain_events_on_subject_type_and_subject_id"
    t.check_constraint "name::text ~ '^[a-z_]+(\\.[a-z_]+)+$'::text", name: "domain_events_name_check"
  end

  create_table "memberships", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "restaurant_id", null: false
    t.string "role", null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["restaurant_id", "user_id"], name: "index_memberships_on_restaurant_id_and_user_id", unique: true
    t.index ["user_id"], name: "index_memberships_on_user_id"
    t.check_constraint "role::text = ANY (ARRAY['owner'::character varying, 'manager'::character varying, 'host'::character varying, 'waiter'::character varying, 'kitchen'::character varying]::text[])", name: "memberships_role_check"
  end

  create_table "restaurants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.string "status", default: "active", null: false
    t.string "address"
    t.string "city"
    t.string "phone"
    t.string "email"
    t.decimal "latitude", precision: 9, scale: 6
    t.decimal "longitude", precision: 9, scale: 6
    t.string "time_zone", default: "Europe/Sarajevo", null: false
    t.boolean "has_host", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "modules", default: [], null: false, array: true
    t.string "content_locales", default: ["bs", "en"], null: false, array: true
    t.index ["slug"], name: "index_restaurants_on_slug", unique: true
    t.index ["status"], name: "index_restaurants_on_status"
    t.check_constraint "content_locales <@ ARRAY['bs'::character varying, 'en'::character varying] AND cardinality(content_locales) >= 1", name: "restaurants_content_locales_check"
    t.check_constraint "latitude >= '-90'::integer::numeric AND latitude <= 90::numeric", name: "restaurants_latitude_check"
    t.check_constraint "longitude >= '-180'::integer::numeric AND longitude <= 180::numeric", name: "restaurants_longitude_check"
    t.check_constraint "modules <@ ARRAY['qr_menu'::character varying, 'table_service'::character varying, 'ordering'::character varying, 'billing'::character varying, 'fiscal'::character varying, 'reservations'::character varying, 'public_page'::character varying, 'reviews'::character varying, 'recipes'::character varying, 'inventory'::character varying, 'purchasing'::character varying, 'scheduling'::character varying, 'haccp'::character varying, 'finance'::character varying, 'guests'::character varying, 'loyalty'::character varying, 'online_orders'::character varying]", name: "restaurants_modules_check"
    t.check_constraint "status::text = ANY (ARRAY['active'::character varying, 'suspended'::character varying]::text[])", name: "restaurants_status_check"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email", null: false
    t.string "encrypted_password", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.string "jti", null: false
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.string "full_name", null: false
    t.string "platform_role"
    t.string "locale"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
    t.check_constraint "locale::text = ANY (ARRAY['bs'::character varying, 'en'::character varying]::text[])", name: "users_locale_check"
    t.check_constraint "platform_role::text = ANY (ARRAY['super_admin'::character varying, 'moderator'::character varying]::text[])", name: "users_platform_role_check"
  end

  create_table "versions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "item_type", null: false
    t.uuid "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.jsonb "object"
    t.jsonb "object_changes"
    t.uuid "restaurant_id"
    t.jsonb "metadata", default: {}, null: false
    t.datetime "created_at", null: false
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
    t.index ["restaurant_id", "created_at"], name: "index_versions_on_restaurant_id_and_created_at"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "domain_events", "restaurants", on_delete: :cascade
  add_foreign_key "memberships", "restaurants"
  add_foreign_key "memberships", "users"
end
