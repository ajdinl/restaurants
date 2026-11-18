# frozen_string_literal: true

module Profile
  # Requires the current password. Saving rotates the user's JTI, which signs out every other device.
  class ChangePassword < ApplicationCommand
    publishes 'user.password_changed'

    def call
      # Devise skips the password silently when it is blank; here a blank one is an error.
      if params[:password].blank?
        record.errors.add(:password, :blank)
        return failure(record.errors.errors.dup)
      end
      changed = transaction do
        record.update_with_password(params.to_h.symbolize_keys).tap { |saved| publish(subject: record) if saved }
      end
      changed ? success : failure(record.errors.errors.dup)
    end
  end
end
