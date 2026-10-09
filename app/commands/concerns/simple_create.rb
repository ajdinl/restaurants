# frozen_string_literal: true

module SimpleCreate
  extend ActiveSupport::Concern

  class_methods do
    def creates(model_class)
      define_method(:model_class) { model_class }
    end
  end

  def call
    save_record(model_class.new(params))
  end
end
