# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pundit::Authorization
  include Localization

  # Tailwind v4's browser baseline. Older tablets (e.g. iPads on iOS 16.4+) must keep working.
  allow_browser versions: { safari: 16.4, chrome: 111, firefox: 128, opera: 97, ie: false }

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  set_current_tenant_through_filter

  before_action :authenticate_user!
  before_action :set_current_user
  after_action :verify_authorized, unless: -> { devise_controller? || action_name == 'index' }
  after_action :verify_policy_scoped, if: -> { action_name == 'index' }

  rescue_from Pundit::NotAuthorizedError, with: :render_forbidden

  private

  def pundit_user
    AuthorizationContext.new(user: current_user, restaurant: Current.restaurant, membership: Current.membership)
  end

  def set_current_user
    Current.user = current_user
  end

  def render_forbidden
    render 'errors/forbidden', status: :forbidden
  end
end
