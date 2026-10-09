# frozen_string_literal: true

module Admin
  # Adds an existing user to a restaurant (`record`) with a role.
  class AddMember < ApplicationCommand
    def call
      member = User.find_by(email: params[:email].to_s.strip.downcase)
      membership = Membership.new(restaurant: record, user: member, role: params[:role])
      return failure(I18n.t('commands.admin.add_member.user_not_found'), value: membership) unless member

      save_record(membership)
    end
  end
end
