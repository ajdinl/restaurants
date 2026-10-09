# frozen_string_literal: true

# Deny by default: every policy must explicitly allow each action.
class ApplicationPolicy
  attr_reader :context, :record

  delegate :user, :super_admin?, :moderator?, :platform_staff?, :member?, :role?, :management?, to: :context

  def initialize(context, record)
    raise Pundit::NotAuthorizedError, 'must be signed in' unless context&.user

    @context = context
    @record = record
  end

  def index?
    false
  end

  def show?
    false
  end

  def create?
    false
  end

  def new?
    create?
  end

  def update?
    false
  end

  def edit?
    update?
  end

  def destroy?
    false
  end

  class Scope
    delegate :user, :super_admin?, :moderator?, :platform_staff?, :member?, :role?, :management?, to: :context

    def initialize(context, scope)
      raise Pundit::NotAuthorizedError, 'must be signed in' unless context&.user

      @context = context
      @scope = scope
    end

    def resolve
      raise NoMethodError, "You must define #resolve in #{self.class}"
    end

    private

    attr_reader :context, :scope
  end
end
