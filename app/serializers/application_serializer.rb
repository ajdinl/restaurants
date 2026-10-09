# frozen_string_literal: true

# JSON:API serializers, flattened to { id, ...attributes } for the frontend.
# Serializers stay dumb: no queries. Preload associations in the controller.
class ApplicationSerializer
  include JSONAPI::Serializer

  def self.render(resource, params: {})
    data = new(resource, params:).serializable_hash[:data]
    data.is_a?(Array) ? data.map { |item| flatten(item) } : flatten(data)
  end

  def self.flatten(item)
    item && { id: item[:id] }.merge(item[:attributes])
  end
end
