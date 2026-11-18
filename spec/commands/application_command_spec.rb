# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationCommand do
  let(:admin) { create(:user, :super_admin) }
  let(:restaurant) { create(:restaurant) }

  def update_command(event: 'restaurant.updated')
    Class.new(described_class) do
      include SimpleUpdate

      publishes event
    end
  end

  describe 'publishing' do
    it 'writes the declared event with subject, actor, restaurant and changed attribute names' do
      update_command.call(user: admin, record: restaurant, params: { phone: '033 123 456' })
      expect(DomainEvent.last).to have_attributes(
        name: 'restaurant.updated', subject_type: 'Restaurant', subject_id: restaurant.id, actor_id: admin.id,
        restaurant_id: restaurant.id, payload: { 'changed' => ['phone'] }
      )
    end

    it 'writes nothing when the change fails' do
      result = update_command.call(user: admin, record: restaurant, params: { name: '' })
      expect(result).to be_failure
      expect(DomainEvent.count).to eq(0)
    end

    it 'rolls the change back when the event cannot be written' do
      command = update_command(event: 'Not Valid')
      expect { command.call(user: admin, record: restaurant, params: { phone: '033 123 456' }) }.to raise_error(ActiveRecord::RecordInvalid)
      expect(restaurant.reload.phone).to be_nil
    end

    it 'uses the tenant as restaurant for subjects without one' do
      ActsAsTenant.current_tenant = restaurant
      Class.new(described_class) do
        def call
          publish('user.updated', subject: user)
        end
      end.call(user: admin)
      expect(DomainEvent.last.restaurant).to eq(restaurant)
    end
  end

  describe 'history' do
    it 'records the command user as the author of versions' do
      update_command.call(user: admin, record: restaurant, params: { phone: '033 123 456' })
      expect(restaurant.versions.last.whodunnit).to eq(admin.id)
    end
  end
end
