# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Admin::UserPolicy do
  let(:super_admin_user) { create(:user, :super_admin) }
  let(:super_admin) { context_for(super_admin_user) }
  let(:moderator) { context_for(create(:user, :moderator)) }
  let(:regular) { context_for(create(:user)) }
  let(:staff_account) { create(:user) }
  let(:other_moderator) { create(:user, :moderator) }

  permissions :index?, :create? do
    it { expect(described_class).to permit(moderator, User) }
    it { expect(described_class).not_to permit(regular, User) }
  end

  permissions :update? do
    it { expect(described_class).to permit(super_admin, other_moderator) }
    it { expect(described_class).to permit(moderator, staff_account) }
    it { expect(described_class).not_to permit(moderator, other_moderator) }
    it { expect(described_class).not_to permit(moderator, super_admin_user) }
    it { expect(described_class).not_to permit(regular, staff_account) }
  end

  permissions :destroy? do
    it { expect(described_class).to permit(super_admin, staff_account) }
    it { expect(described_class).not_to permit(super_admin, super_admin_user) }
    it { expect(described_class).not_to permit(moderator, staff_account) }
  end

  describe 'permitted attributes' do
    it 'lets only super admins assign platform roles' do
      expect(described_class.new(super_admin, User).permitted_attributes).to include(:platform_role)
      expect(described_class.new(moderator, User).permitted_attributes).not_to include(:platform_role)
    end

    it 'does not let a super admin change their own platform role' do
      expect(described_class.new(super_admin, super_admin_user).permitted_attributes).not_to include(:platform_role)
    end

    it 'accepts a password on create but not on update' do
      policy = described_class.new(super_admin, User)
      expect(policy.permitted_attributes_for_create).to include(:password)
      expect(policy.permitted_attributes_for_update).not_to include(:password)
    end
  end
end
