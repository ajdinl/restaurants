# frozen_string_literal: true

class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # No SVG: it can carry scripts. The type is detected from the file's bytes, not its name.
  AVATAR_CONTENT_TYPES = %w[image/png image/jpeg image/webp].freeze
  AVATAR_MAX_BYTES = 2.megabytes

  devise :database_authenticatable, :recoverable, :validatable, :trackable, :lockable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  enum :platform_role, { super_admin: 'super_admin', moderator: 'moderator' }, validate: { allow_nil: true }

  has_many :memberships, dependent: :destroy
  has_many :restaurants, through: :memberships

  has_one_attached :avatar

  validates :full_name, presence: true, length: { maximum: 120 }
  validates :locale, inclusion: { in: I18n.available_locales.map(&:to_s) }, allow_nil: true
  validate :avatar_is_small_image, if: -> { avatar.attached? }

  # A new password signs the user out everywhere by invalidating every issued JWT.
  before_update :rotate_jti, if: :will_save_change_to_encrypted_password?

  def platform_staff?
    super_admin? || moderator?
  end

  private

  def avatar_is_small_image
    errors.add(:avatar, :invalid_type) unless AVATAR_CONTENT_TYPES.include?(avatar.blob.content_type)
    errors.add(:avatar, :too_big, count: AVATAR_MAX_BYTES / 1.megabyte) if avatar.blob.byte_size > AVATAR_MAX_BYTES
  end

  def rotate_jti
    self.jti = SecureRandom.uuid
  end
end
