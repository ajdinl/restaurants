# frozen_string_literal: true

module Api
  module V1
    class MeController < BaseController
      skip_after_action :verify_authorized

      def show
        render_success(CurrentUserSerializer.render(current_user_with_memberships))
      end

      def update
        result = Profile::UpdateDetails.call(user: current_user, record: current_user, params: params.expect(user: %i[full_name locale]))
        return render_errors(result.errors) if result.failure?

        render_success(CurrentUserSerializer.render(current_user_with_memberships))
      end

      private

      def current_user_with_memberships
        User.includes(memberships: :restaurant, avatar_attachment: :blob).find(current_user.id)
      end
    end
  end
end
