# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, skip: :registrations, controllers: { sessions: 'users/sessions' }

  resource :locale, only: :update

  namespace :admin do
    root 'dashboard#show'

    resources :restaurants do
      member do
        patch :suspend
        patch :activate
      end
      resources :memberships, only: %i[create update destroy]
    end
    resources :users, except: :show
  end

  scope 'r/:restaurant_slug', module: :workspace, as: :workspace do
    root 'dashboard#show'
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get 'up' => 'rails/health#show', as: :rails_health_check

  root 'home#show'
end
