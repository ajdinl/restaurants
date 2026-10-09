# frozen_string_literal: true

module Api
  module V1
    module Admin
      # Platform area for super admins and moderators. Works across all restaurants, so no tenant is set.
      class BaseController < Api::V1::BaseController
        before_action :require_platform_staff!
        around_action :without_tenant

        private

        # 404 rather than 403, so other users do not learn the admin API exists.
        def require_platform_staff!
          raise ActiveRecord::RecordNotFound unless current_user.platform_staff?
        end

        def without_tenant(&)
          ActsAsTenant.without_tenant(&)
        end
      end
    end
  end
end
