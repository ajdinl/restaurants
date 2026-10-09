# frozen_string_literal: true

module Api
  module V1
    module Admin
      class MembershipsController < BaseController
        before_action :set_restaurant
        before_action :set_membership, only: %i[update destroy]

        def index
          memberships = policy_scope([:admin, Membership]).where(restaurant: @restaurant).includes(:user).order(:created_at)
          render_success(MembershipSerializer.render(memberships))
        end

        def create
          authorize [:admin, Membership]
          result = ::Admin::AddMember.call(user: current_user, record: @restaurant, params: params.expect(membership: %i[email role]))
          render_command_result(result, serializer: MembershipSerializer, status: :created)
        end

        def update
          authorize [:admin, @membership]
          result = ::Admin::UpdateMember.call(user: current_user, record: @membership, params: params.expect(membership: %i[role active]))
          render_command_result(result, serializer: MembershipSerializer)
        end

        def destroy
          authorize [:admin, @membership]
          result = ::Admin::RemoveMember.call(user: current_user, record: @membership)
          result.success? ? head(:no_content) : render_errors(result.errors)
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
  end
end
