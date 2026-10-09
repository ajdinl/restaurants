# frozen_string_literal: true

# All business logic lives in commands. Controllers authorize, call one command and render its Result.
class ApplicationCommand
  Result = Data.define(:status, :value, :errors) do
    def success?
      status == :success
    end

    def failure?
      status == :failure
    end
  end

  attr_reader :user, :params, :record

  def self.call(...)
    new(...).call
  end

  # `record` is the already-authorized record the command acts on; commands never re-fetch it.
  def initialize(user:, params: {}, record: nil)
    @user = user
    @params = params
    @record = record
  end

  def call
    raise NotImplementedError, "#{self.class}#call must be implemented"
  end

  private

  def success(value = record)
    Result.new(status: :success, value:, errors: [])
  end

  def failure(errors, value: record)
    Result.new(status: :failure, value:, errors: Array(errors))
  end

  # On failure the Result still carries the record, so forms can re-render with its errors.
  def save_record(model)
    model.save ? success(model) : failure(model.errors.full_messages, value: model)
  end
end
