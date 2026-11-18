# frozen_string_literal: true

# Subscribers to domain events (D36). Register them in config/initializers/domain_events.rb:
#   DomainEvents.subscribe('stock.below_minimum', Inventory::NotifyLowStock)
# A handler responds to `.call(event)` and runs in DomainEvents::DispatchJob with the event's restaurant
# as the tenant. '*' receives every event (automations, webhooks).
module DomainEvents
  mattr_accessor :subscribers, default: Hash.new { |hash, name| hash[name] = [] }

  def self.subscribe(name, handler)
    subscribers[name.to_s] |= [handler]
  end

  def self.handlers_for(name)
    subscribers.fetch(name.to_s, []) + subscribers.fetch('*', [])
  end

  def self.reset!
    subscribers.clear
  end
end
