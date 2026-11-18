# frozen_string_literal: true

module Workspace
  # Flat map of what the caller may do in the current restaurant ({ "menu.manage" => true, ... }), computed from the
  # policies so the frontend never re-implements role rules (ARCHITECTURE §6). Each phase adds its keys here.
  class Abilities
    # ability key => [headless policy target, query]
    MAP = {
      'settings.view' => [%i[workspace settings], :show?],
      'settings.manage' => [%i[workspace settings], :update?],
      'staff.view' => [%i[workspace staff_member], :index?],
      'staff.manage' => [%i[workspace staff_member], :manage?],
      'menu.view' => [%i[workspace menu_item], :index?],
      'menu.manage' => [%i[workspace menu_item], :manage?],
      'menu.availability' => [%i[workspace menu_item], :availability?],
      'floor.view' => [%i[workspace dining_table], :index?],
      'floor.manage' => [%i[workspace dining_table], :manage?],
      'activity.view' => [%i[workspace activity], :index?]
    }.freeze

    def self.for(context)
      new(context).to_h
    end

    def initialize(context)
      @context = context
    end

    def to_h
      MAP.transform_values { |(target, query)| Pundit.policy!(@context, target).public_send(query) }
    end
  end
end
