# frozen_string_literal: true

# Keeps a PaperTrail history of the model, tagged with its restaurant so the activity log can read
# one restaurant's changes. Who made the change comes from the command (`ApplicationCommand.call`).
module Versioned
  extend ActiveSupport::Concern

  included do
    has_paper_trail ignore: %i[updated_at], meta: { restaurant_id: :version_restaurant_id }
  end

  private

  def version_restaurant_id
    is_a?(Restaurant) ? id : restaurant_id
  end
end
