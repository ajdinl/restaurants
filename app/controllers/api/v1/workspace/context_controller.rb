# frozen_string_literal: true

module Api
  module V1
    module Workspace
      # Everything the frontend needs to render a workspace: the restaurant, the caller's membership,
      # enabled modules and the abilities map that drives navigation and buttons.
      class ContextController < BaseController
        def show
          authorize %i[workspace context], :show?
          render_success({ restaurant: RestaurantSerializer.render(Current.restaurant),
                           membership: Current.membership&.slice(:id, :role),
                           support_view: Current.membership.nil?,
                           modules: Current.restaurant.modules,
                           abilities: ::Workspace::Abilities.for(pundit_user) })
        end
      end
    end
  end
end
