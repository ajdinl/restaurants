# frozen_string_literal: true

module SimpleUpdate
  def call
    record.assign_attributes(params)
    save_record(record)
  end
end
