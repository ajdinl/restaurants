# frozen_string_literal: true

module Admin
  class UsersController < BaseController
    before_action :set_user, only: %i[edit update destroy]

    def index
      @users = policy_scope([:admin, User]).order(:full_name)
    end

    def new
      @user = authorize([:admin, User.new])
    end

    def edit
      authorize [:admin, @user]
    end

    def create
      authorize [:admin, User]
      result = Admin::CreateUser.call(user: current_user, params: permitted_attributes([:admin, User], :create))
      @user = result.value
      return render(:new, status: :unprocessable_content) if result.failure?

      redirect_to admin_users_path, notice: t('.success')
    end

    def update
      authorize [:admin, @user]
      result = Admin::UpdateUser.call(user: current_user, record: @user, params: permitted_attributes([:admin, @user], :update))
      return render(:edit, status: :unprocessable_content) if result.failure?

      redirect_to admin_users_path, notice: t('.success')
    end

    def destroy
      authorize [:admin, @user]
      result = Admin::DestroyUser.call(user: current_user, record: @user)
      return redirect_to(admin_users_path, alert: result.errors.to_sentence) if result.failure?

      redirect_to admin_users_path, notice: t('.success'), status: :see_other
    end

    private

    def set_user
      @user = User.find(params.expect(:id))
    end
  end
end
