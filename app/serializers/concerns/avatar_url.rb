# frozen_string_literal: true

# Adds avatar_url to a user serializer. Expects includes(avatar_attachment: :blob).
module AvatarUrl
  extend ActiveSupport::Concern

  included do
    attribute :avatar_url do |user|
      Rails.application.routes.url_helpers.rails_blob_url(user.avatar) if user.avatar.attached?
    end
  end
end
