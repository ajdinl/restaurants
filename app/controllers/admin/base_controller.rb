# frozen_string_literal: true

module Admin
  # Platform area for super admins and moderators. Works across all restaurants, so no tenant is set.
  class BaseController < ApplicationController
    before_action :require_platform_staff!
    around_action :without_tenant

    private

    # 404 rather than 403, so other users do not learn the admin area exists.
    def require_platform_staff!
      raise ActiveRecord::RecordNotFound unless current_user.platform_staff?
    end

    def without_tenant(&)
      ActsAsTenant.without_tenant(&)
    end

    def flash_for(result, success_message)
      result.success? ? { notice: success_message } : { alert: result.errors.to_sentence }
    end
  end
end
