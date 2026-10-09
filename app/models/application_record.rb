# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  before_create :assign_uuid_v7

  private

  # UUIDv7 keys are time-ordered (index-friendly, sortable by id), unlike the gen_random_uuid() v4 column default.
  def assign_uuid_v7
    return if id.present?
    return unless self.class.columns_hash[self.class.primary_key]&.type == :uuid

    self.id = SecureRandom.uuid_v7
  end
end
