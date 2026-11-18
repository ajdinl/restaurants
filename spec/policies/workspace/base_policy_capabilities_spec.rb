# frozen_string_literal: true

require 'rails_helper'

# Role matrix for the workspace capability policies (subclasses of BasePolicy) (phase 1, "Policies and abilities").
RSpec.describe Workspace::BasePolicy, type: :policy do
  let(:restaurant) { create(:restaurant) }

  roles = %i[owner manager host waiter kitchen moderator super_admin outsider].freeze

  matrix = {
    [Workspace::SettingsPolicy, :show?] => %i[owner manager host waiter kitchen moderator super_admin],
    [Workspace::SettingsPolicy, :update?] => %i[owner manager super_admin],
    [Workspace::StaffMemberPolicy, :index?] => %i[owner manager moderator super_admin],
    [Workspace::StaffMemberPolicy, :manage?] => %i[owner manager super_admin],
    [Workspace::MenuItemPolicy, :index?] => %i[owner manager host waiter kitchen moderator super_admin],
    [Workspace::MenuItemPolicy, :manage?] => %i[owner manager super_admin],
    [Workspace::MenuItemPolicy, :availability?] => %i[owner manager kitchen super_admin],
    [Workspace::DiningTablePolicy, :index?] => %i[owner manager host waiter kitchen moderator super_admin],
    [Workspace::DiningTablePolicy, :manage?] => %i[owner manager super_admin],
    [Workspace::ActivityPolicy, :index?] => %i[owner manager moderator super_admin],
    [Workspace::ContextPolicy, :show?] => %i[owner manager host waiter kitchen moderator super_admin]
  }.freeze

  def context_as(role)
    user = case role
           when :moderator, :super_admin then create(:user, role)
           when :outsider then create(:membership, :owner).user
           else create(:membership, role, restaurant:).user
           end
    context_for(user, restaurant:)
  end

  matrix.each do |(policy, query), allowed|
    describe "#{policy.name}##{query}" do
      roles.each do |role|
        it "#{allowed.include?(role) ? 'allows' : 'denies'} #{role}" do
          expect(policy.new(context_as(role), nil).public_send(query)).to be(allowed.include?(role))
        end
      end
    end
  end

  it 'denies inactive members everything' do
    context = context_for(create(:membership, :owner, :inactive, restaurant:).user, restaurant:)
    expect(Workspace::Abilities.for(context).values).to all(be(false))
  end
end
