# frozen_string_literal: true

source 'https://rubygems.org'

ruby '3.3.5'

gem 'bootsnap', require: false
gem 'pg', '~> 1.1'
gem 'puma', '>= 5.0'
gem 'rails', '~> 8.1.2'
gem 'tzinfo-data', platforms: %i[windows jruby]

# Authentication & Authorization
gem 'devise', '~> 5.0'
gem 'devise-i18n', '~> 1.16'
gem 'devise-jwt', '~> 0.13'
gem 'pundit', '~> 2.5'

# Multi-tenancy
gem 'acts_as_tenant', '~> 2.2'

# API
gem 'jsonapi-serializer', '~> 2.2'
gem 'rack-attack', '~> 6.8'
gem 'rack-cors', '~> 3.0'

# Error Monitoring (enabled only when SENTRY_DSN is set)
gem 'sentry-rails', '~> 7.1'
gem 'sentry-ruby', '~> 7.1'

# i18n (bs + en)
gem 'rails-i18n', '~> 8.1'

# Database-backed adapters for Rails.cache, Active Job and Action Cable
gem 'solid_cable'
gem 'solid_cache'
gem 'solid_queue'

# Environment (.env in development/test)
gem 'dotenv-rails', '~> 3.1', groups: %i[development test]

# Database Safety
gem 'strong_migrations', '~> 2.8'

# Active Storage variants
gem 'image_processing', '~> 1.2'

# Deployment
gem 'kamal', require: false
gem 'thruster', require: false

group :development, :test do
  gem 'brakeman', require: false
  gem 'bullet', '~> 8.2'
  gem 'bundler-audit', require: false
  gem 'debug', platforms: %i[mri windows], require: 'debug/prelude'
  gem 'factory_bot_rails', '~> 6.5'
  gem 'faker', '~> 3.8'
  gem 'i18n-tasks', '~> 1.0', require: false
  gem 'rspec-rails', '~> 8.0'
  gem 'rubocop', require: false
  gem 'rubocop-rails', require: false
  gem 'rubocop-rspec', require: false
end

group :test do
  gem 'shoulda-matchers', '~> 8.0'
  gem 'simplecov', require: false
end
