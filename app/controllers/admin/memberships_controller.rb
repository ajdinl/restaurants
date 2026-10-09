# frozen_string_literal: true

module Admin
  class MembershipsController < BaseController
    before_action :set_restaurant
    before_action :set_membership, only: %i[update destroy]

    def create
      authorize [:admin, Membership]
      result = Admin::AddMember.call(user: current_user, record: @restaurant, params: params.expect(membership: %i[email role]))
      redirect_to admin_restaurant_path(@restaurant), flash_for(result, t('.success'))
    end

    def update
      authorize [:admin, @membership]
      result = Admin::UpdateMember.call(user: current_user, record: @membership, params: params.expect(membership: %i[role active]))
      redirect_to admin_restaurant_path(@restaurant), flash_for(result, t('.success'))
    end

    def destroy
      authorize [:admin, @membership]
      result = Admin::RemoveMember.call(user: current_user, record: @membership)
      redirect_to admin_restaurant_path(@restaurant), flash_for(result, t('.success')).merge(status: :see_other)
    end

    private

    def set_restaurant
      @restaurant = Restaurant.find_by!(slug: params.expect(:restaurant_id))
    end

    # Scoped through the restaurant so a membership id from another restaurant 404s.
    def set_membership
      @membership = @restaurant.memberships.find(params.expect(:id))
    end
  end
end
