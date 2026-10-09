# frozen_string_literal: true

class UserSerializer < ApplicationSerializer
  include AvatarUrl

  attributes :email, :full_name, :platform_role, :locale, :created_at

  attribute :locked, &:access_locked?
end
