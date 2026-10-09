# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User do
  subject { build(:user) }

  describe 'associations' do
    it { is_expected.to have_many(:memberships).dependent(:destroy) }
    it { is_expected.to have_many(:restaurants).through(:memberships) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:full_name) }
    it { is_expected.to validate_length_of(:full_name).is_at_most(120) }
    it { is_expected.to validate_inclusion_of(:locale).in_array(%w[bs en]).allow_nil }

    it 'requires a password of at least 10 characters' do
      user = build(:user, password: 'short')
      expect(user).not_to be_valid
      expect(user.errors[:password]).to be_present
    end

    it 'rejects unknown platform roles' do
      expect(build(:user, platform_role: 'owner')).not_to be_valid
    end
  end

  describe '#platform_staff?' do
    it 'is true for super admins and moderators only' do
      expect(build(:user, :super_admin)).to be_platform_staff
      expect(build(:user, :moderator)).to be_platform_staff
      expect(build(:user)).not_to be_platform_staff
    end
  end

  it 'gets a time-ordered UUIDv7 primary key' do
    user = create(:user)
    expect(user.id).to match(/\A\h{8}-\h{4}-7\h{3}-[89ab]\h{3}-\h{12}\z/)
  end
end
