# frozen_string_literal: true

# Wire domain event subscribers here (see app/events/domain_events.rb). Rebuilt on every code reload.
Rails.application.config.to_prepare do
  DomainEvents.reset!
end
