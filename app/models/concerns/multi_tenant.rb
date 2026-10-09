# frozen_string_literal: true

# Include in every model that belongs to one restaurant. Adds belongs_to :restaurant and scopes
# all queries to ActsAsTenant.current_tenant. Do not declare belongs_to :restaurant yourself.
module MultiTenant
  extend ActiveSupport::Concern

  included do
    acts_as_tenant :restaurant
  end
end
