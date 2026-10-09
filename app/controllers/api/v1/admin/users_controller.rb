# frozen_string_literal: true

module Api
  module V1
    module Admin
      class UsersController < BaseController
        before_action :set_user, only: %i[show update destroy]

        def index
          render_paginated(UserSerializer, policy_scope([:admin, User]).includes(avatar_attachment: :blob).order(:full_name))
        end

        def show
          authorize [:admin, @user]
          render_success(UserSerializer.render(@user))
        end

        def create
          authorize [:admin, User]
          result = ::Admin::CreateUser.call(user: current_user, params: permitted_attributes([:admin, User], :create))
          render_command_result(result, serializer: UserSerializer, status: :created)
        end

        def update
          authorize [:admin, @user]
          result = ::Admin::UpdateUser.call(user: current_user, record: @user, params: permitted_attributes([:admin, @user], :update))
          render_command_result(result, serializer: UserSerializer)
        end

        def destroy
          authorize [:admin, @user]
          result = ::Admin::DestroyUser.call(user: current_user, record: @user)
          result.success? ? head(:no_content) : render_errors(result.errors)
        end

        private

        def set_user
          @user = User.find(params.expect(:id))
        end
      end
    end
  end
end
