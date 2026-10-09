# frozen_string_literal: true

class User < ApplicationRecord
  devise :database_authenticatable, :recoverable, :rememberable, :validatable, :trackable, :lockable

  enum :platform_role, { super_admin: 'super_admin', moderator: 'moderator' }, validate: { allow_nil: true }

  has_many :memberships, dependent: :destroy
  has_many :restaurants, through: :memberships

  validates :full_name, presence: true, length: { maximum: 120 }
  validates :locale, inclusion: { in: I18n.available_locales.map(&:to_s) }, allow_nil: true

  def platform_staff?
    super_admin? || moderator?
  end
end
