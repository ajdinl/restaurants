# frozen_string_literal: true

require 'rails_helper'

# Every state-changing command publishes a domain event (D36).
RSpec.describe 'Published domain events' do
  let(:admin) { create(:user, :super_admin) }
  let(:restaurant) { create(:restaurant) }
  let(:image) { Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/files/avatar.png'), 'image/png') }

  def last_event
    DomainEvent.order(:occurred_at, :id).last
  end

  {
    'restaurant.created' => -> { Admin::CreateRestaurant.call(user: admin, params: { name: 'Novi' }) },
    'restaurant.updated' => -> { Admin::UpdateRestaurant.call(user: admin, record: restaurant, params: { city: 'Mostar' }) },
    'restaurant.suspended' => -> { Admin::SuspendRestaurant.call(user: admin, record: restaurant) },
    'restaurant.activated' => -> { Admin::ActivateRestaurant.call(user: admin, record: create(:restaurant, :suspended)) },
    'membership.created' => -> { Admin::AddMember.call(user: admin, record: restaurant, params: { email: create(:user).email, role: 'waiter' }) },
    'membership.updated' => -> { Admin::UpdateMember.call(user: admin, record: create(:membership, restaurant:), params: { role: 'host' }) },
    'membership.removed' => -> { Admin::RemoveMember.call(user: admin, record: create(:membership, restaurant:)) },
    'user.created' => -> { Admin::CreateUser.call(user: admin, params: { full_name: 'Ana', email: 'ana@example.com', password: 'password1234' }) },
    'user.updated' => -> { Admin::UpdateUser.call(user: admin, record: create(:user), params: { full_name: 'Ana' }) },
    'user.destroyed' => -> { Admin::DestroyUser.call(user: admin, record: create(:user)) },
    'user.profile_updated' => -> { Profile::UpdateDetails.call(user: admin, record: admin, params: { full_name: 'Ana' }) },
    'user.password_changed' => lambda {
      Profile::ChangePassword.call(user: admin, record: admin,
                                   params: { current_password: 'password123', password: 'new-password-1', password_confirmation: 'new-password-1' })
    },
    'user.avatar_updated' => -> { Profile::UpdateAvatar.call(user: admin, record: admin, params: { avatar: image }) },
    'user.avatar_removed' => lambda {
      admin.update!(avatar: image)
      Profile::RemoveAvatar.call(user: admin, record: admin)
    }
  }.each do |name, run|
    it "publishes #{name}" do
      result = instance_exec(&run)
      expect(result).to be_success
      expect(last_event).to have_attributes(name:, actor_id: admin.id)
    end
  end

  it 'publishes restaurant.destroyed as a platform event that keeps the restaurant id' do
    Admin::DestroyRestaurant.call(user: admin, record: restaurant)
    expect(last_event).to have_attributes(name: 'restaurant.destroyed', restaurant_id: nil, subject_id: restaurant.id)
  end

  it 'ties membership events to the restaurant' do
    Admin::RemoveMember.call(user: admin, record: create(:membership, restaurant:))
    expect(last_event.restaurant).to eq(restaurant)
  end
end
