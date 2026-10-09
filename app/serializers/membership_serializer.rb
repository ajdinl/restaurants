# frozen_string_literal: true

# Expects :user preloaded.
class MembershipSerializer < ApplicationSerializer
  attributes :role, :active

  attribute :user do |membership|
    { id: membership.user.id, full_name: membership.user.full_name, email: membership.user.email }
  end
end
