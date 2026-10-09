# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, path: 'api/v1/auth', only: %i[sessions passwords],
                     path_names: { sign_in: 'sign_in', sign_out: 'sign_out' },
                     controllers: { sessions: 'api/v1/auth/sessions', passwords: 'api/v1/auth/passwords' },
                     defaults: { format: :json }

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resource :me, only: %i[show update], controller: :me

      namespace :admin do
        resource :dashboard, only: :show, controller: :dashboard
        resources :restaurants, except: %i[new edit] do
          member do
            patch :suspend
            patch :activate
          end
          resources :memberships, only: %i[index create update destroy]
        end
        resources :users, except: %i[new edit]
      end

      scope 'restaurants/:restaurant_slug', module: :workspace, as: :workspace do
        resource :dashboard, only: :show, controller: :dashboard
      end
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get 'up' => 'rails/health#show', as: :rails_health_check
end
