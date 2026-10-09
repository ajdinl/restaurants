# frozen_string_literal: true

module Admin
  class RestaurantsController < BaseController
    PERMITTED_PARAMS = %i[name slug address city phone email latitude longitude time_zone has_host].freeze

    before_action :set_restaurant, except: %i[index new create]

    def index
      @restaurants = policy_scope([:admin, Restaurant]).order(:name)
    end

    def show
      authorize [:admin, @restaurant]
      @memberships = @restaurant.memberships.includes(:user).order(:created_at)
    end

    def new
      @restaurant = authorize([:admin, Restaurant.new])
    end

    def edit
      authorize [:admin, @restaurant]
    end

    def create
      authorize [:admin, Restaurant]
      result = Admin::CreateRestaurant.call(user: current_user, params: restaurant_params)
      @restaurant = result.value
      return render(:new, status: :unprocessable_content) if result.failure?

      redirect_to admin_restaurant_path(@restaurant), notice: t('.success')
    end

    def update
      authorize [:admin, @restaurant]
      result = Admin::UpdateRestaurant.call(user: current_user, record: @restaurant, params: restaurant_params)
      return render(:edit, status: :unprocessable_content) if result.failure?

      redirect_to admin_restaurant_path(@restaurant), notice: t('.success')
    end

    def suspend
      authorize [:admin, @restaurant]
      result = Admin::SuspendRestaurant.call(user: current_user, record: @restaurant)
      redirect_to admin_restaurant_path(@restaurant), flash_for(result, t('.success'))
    end

    def activate
      authorize [:admin, @restaurant]
      result = Admin::ActivateRestaurant.call(user: current_user, record: @restaurant)
      redirect_to admin_restaurant_path(@restaurant), flash_for(result, t('.success'))
    end

    def destroy
      authorize [:admin, @restaurant]
      result = Admin::DestroyRestaurant.call(user: current_user, record: @restaurant)
      return redirect_to(admin_restaurant_path(@restaurant), alert: result.errors.to_sentence) if result.failure?

      redirect_to admin_restaurants_path, notice: t('.success'), status: :see_other
    end

    private

    def set_restaurant
      @restaurant = Restaurant.find_by!(slug: params.expect(:id))
    end

    def restaurant_params
      params.expect(restaurant: PERMITTED_PARAMS)
    end
  end
end
