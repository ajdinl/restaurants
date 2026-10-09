# frozen_string_literal: true

class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :recoverable, :validatable, :trackable, :lockable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  enum :platform_role, { super_admin: 'super_admin', moderator: 'moderator' }, validate: { allow_nil: true }

  has_many :memberships, dependent: :destroy
  has_many :restaurants, through: :memberships

  validates :full_name, presence: true, length: { maximum: 120 }
  validates :locale, inclusion: { in: I18n.available_locales.map(&:to_s) }, allow_nil: true

  # A new password signs the user out everywhere by invalidating every issued JWT.
  before_update :rotate_jti, if: :will_save_change_to_encrypted_password?

  def platform_staff?
    super_admin? || moderator?
  end

  private

  def rotate_jti
    self.jti = SecureRandom.uuid
  end
end
