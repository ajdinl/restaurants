# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users, id: :uuid do |t|
      ## Database authenticatable
      t.string :email, null: false
      t.string :encrypted_password, null: false

      ## Recoverable
      t.string :reset_password_token
      t.datetime :reset_password_sent_at

      ## JWT revocation (devise-jwt JTIMatcher)
      t.string :jti, null: false

      ## Trackable
      t.integer :sign_in_count, null: false, default: 0
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string :current_sign_in_ip
      t.string :last_sign_in_ip

      ## Lockable
      t.integer :failed_attempts, null: false, default: 0
      t.string :unlock_token
      t.datetime :locked_at

      t.string :full_name, null: false
      t.string :platform_role
      t.string :locale

      t.timestamps

      t.index :email, unique: true
      t.index :reset_password_token, unique: true
      t.index :unlock_token, unique: true
      t.index :jti, unique: true
      t.check_constraint "platform_role IN ('super_admin', 'moderator')", name: 'users_platform_role_check'
      t.check_constraint "locale IN ('bs', 'en')", name: 'users_locale_check'
    end
  end
end
