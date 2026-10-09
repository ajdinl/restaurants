# frozen_string_literal: true

class Restaurant < ApplicationRecord
  SLUG_FORMAT = /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/
  TIME_ZONES = TZInfo::Timezone.all_identifiers.freeze

  enum :status, { active: 'active', suspended: 'suspended' }, default: :active, validate: true

  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships

  validates :name, presence: true, length: { maximum: 120 }
  validates :slug, presence: true, uniqueness: true, length: { in: 3..60 }, format: { with: SLUG_FORMAT }
  validates :time_zone, inclusion: { in: TIME_ZONES }
  validates :address, :city, length: { maximum: 200 }
  validates :phone, length: { maximum: 40 }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :latitude, numericality: { in: -90..90 }, allow_nil: true
  validates :longitude, numericality: { in: -180..180 }, allow_nil: true

  before_validation :generate_slug, on: :create

  def to_param
    slug_was.presence || slug
  end

  private

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
