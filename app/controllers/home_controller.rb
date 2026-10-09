# frozen_string_literal: true

# Sends each user to the right place after sign-in.
class HomeController < ApplicationController
  skip_after_action :verify_authorized

  def show
    return redirect_to(admin_root_path) if current_user.platform_staff?

    @memberships = current_user.memberships.active.joins(:restaurant).includes(:restaurant).order('restaurants.name')
    redirect_to workspace_root_path(@memberships.first.restaurant) if @memberships.one?
  end
end
