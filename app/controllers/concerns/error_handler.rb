# frozen_string_literal: true

# Every error leaves the API as { errors: [{ message, field }] }. Messages never expose model names.
module ErrorHandler
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
    rescue_from Pundit::NotAuthorizedError, with: :render_forbidden
    rescue_from ActionController::ParameterMissing, with: :render_bad_request
  end

  private

  def render_not_found
    render_errors(t('errors.not_found'), status: :not_found)
  end

  def render_forbidden
    render_errors(t('errors.forbidden'), status: :forbidden)
  end

  def render_bad_request
    render_errors(t('errors.bad_request'), status: :bad_request)
  end
end
