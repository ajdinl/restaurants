# frozen_string_literal: true

# All business logic lives in commands. Controllers authorize, call one command and render its Result.
#
# Every command that changes something publishes a domain event (D36): declare it with `publishes 'restaurant.created'`
# and `save_record` / `destroy_record` publish it in the same transaction as the change, or call `publish` yourself
# inside `transaction`. PaperTrail records the command's user as the author of every version written during `call`.
class ApplicationCommand
  Result = Data.define(:status, :value, :errors) do
    def success?
      status == :success
    end

    def failure?
      status == :failure
    end
  end

  TIMESTAMPS = %w[created_at updated_at].freeze

  class_attribute :event_name, instance_writer: false

  attr_reader :user, :params, :record

  def self.call(...)
    command = new(...)
    PaperTrail.request(whodunnit: command.user&.id) { command.call }
  end

  def self.publishes(name)
    self.event_name = name
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

  def transaction(&)
    ApplicationRecord.transaction(&)
  end

  # On failure the Result still carries the record, so forms can re-render with its errors.
  def save_record(model)
    transaction do
      next failure(model.errors.errors.dup, value: model) unless model.save

      publish(subject: model, payload: { changed: model.saved_changes.keys - TIMESTAMPS }) if event_name
      success(model)
    end
  end

  def destroy_record(model)
    transaction do
      next failure(model.errors.full_messages, value: model) unless model.destroy

      publish(subject: model) if event_name
      success(model)
    end
  end

  # Writes to the domain_events outbox; DomainEvents::DispatchJob delivers it after commit. Call it inside the
  # transaction that makes the change. The payload holds ids and attribute names only: values live in PaperTrail,
  # and nothing secret ever goes in an event.
  def publish(name = event_name, subject:, payload: {}, restaurant: event_restaurant(subject))
    DomainEvent.create!(name:, subject_type: subject.class.name, subject_id: subject.id, actor_id: user&.id,
                        restaurant:, payload:, occurred_at: Time.current)
  end

  # A destroyed restaurant cannot be referenced (its events are deleted with it), so its own
  # destroy event is a platform event.
  def event_restaurant(subject)
    return (subject.destroyed? ? nil : subject) if subject.is_a?(Restaurant)

    subject.try(:restaurant) || ActsAsTenant.current_tenant
  end
end
