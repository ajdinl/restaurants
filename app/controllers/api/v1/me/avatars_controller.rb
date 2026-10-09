# frozen_string_literal: true

module Api
  module V1
    module Me
      class AvatarsController < Api::V1::BaseController
        skip_after_action :verify_authorized

        def update
          result = Profile::UpdateAvatar.call(user: current_user, record: current_user, params: { avatar: params.expect(:avatar) })
          return render_errors(result.errors) if result.failure?

          render_success(CurrentUserSerializer.render(current_user_with_memberships))
        end

        def destroy
          Profile::RemoveAvatar.call(user: current_user, record: current_user)
          head :no_content
        end

        private

        def current_user_with_memberships
          User.includes(memberships: :restaurant, avatar_attachment: :blob).find(current_user.id)
        end
      end
    end
  end
end
