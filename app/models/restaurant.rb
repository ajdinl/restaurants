# frozen_string_literal: true

class Restaurant < ApplicationRecord
  include Versioned

  # Optional modules, switched on per restaurant (ARCHITECTURE §3). Mirrored by restaurants_modules_check.
  MODULES = %w[qr_menu table_service ordering billing fiscal reservations public_page reviews recipes inventory
               purchasing scheduling haccp finance guests loyalty online_orders].freeze
  # Languages restaurant content (menu, description) can be written in. The first selected one is primary.
  CONTENT_LOCALES = %w[bs en].freeze
  SLUG_FORMAT = /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/
  TIME_ZONES = TZInfo::Timezone.all_identifiers.freeze

  enum :status, { active: 'active', suspended: 'suspended' }, default: :active, validate: true

  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships
  has_many :domain_events, dependent: :delete_all

  validates :name, presence: true, length: { maximum: 120 }
  validates :slug, presence: true, uniqueness: true, length: { in: 3..60 }, format: { with: SLUG_FORMAT }
  validates :time_zone, inclusion: { in: TIME_ZONES }
  validates :address, :city, length: { maximum: 200 }
  validates :phone, length: { maximum: 40 }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :latitude, numericality: { in: -90..90 }, allow_nil: true
  validates :longitude, numericality: { in: -180..180 }, allow_nil: true
  validate :modules_are_known
  validate :content_locales_are_supported

  before_validation :generate_slug, on: :create

  def to_param
    slug_was.presence || slug
  end

  def module?(key)
    modules.include?(key.to_s)
  end

  def primary_content_locale
    content_locales.first
  end

  private

  def modules_are_known
    errors.add(:modules, :inclusion) unless (modules - MODULES).empty?
  end

  def content_locales_are_supported
    errors.add(:content_locales, :inclusion) if content_locales.empty? || (content_locales - CONTENT_LOCALES).any?
  end

  def generate_slug
    return if slug.present? || name.blank?

    base = name.parameterize.first(50).delete_suffix('-')
    candidate = base
    suffix = 1
    while Restaurant.exists?(slug: candidate)
      suffix += 1
      candidate = "#{base}-#{suffix}"
    end
    self.slug = candidate
  end
end
