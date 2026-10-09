# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Admin user commands' do
  let(:admin) { create(:user, :super_admin) }

  describe Admin::CreateUser do
    it 'creates a user' do
      result = described_class.call(user: admin, params: { full_name: 'Ana Anić', email: 'ana@example.com', password: 'password123' })
      expect(result).to be_success
      expect(result.value).to be_persisted
    end

    it 'fails with a duplicate email' do
      create(:user, email: 'ana@example.com')
      result = described_class.call(user: admin, params: { full_name: 'Ana', email: 'ANA@example.com', password: 'password123' })
      expect(result).to be_failure
    end
  end

  describe Admin::UpdateUser do
    it 'updates the user' do
      account = create(:user)
      expect(described_class.call(user: admin, record: account, params: { full_name: 'Novo Ime' })).to be_success
      expect(account.reload.full_name).to eq('Novo Ime')
    end

    it 'fails on invalid input' do
      expect(described_class.call(user: admin, record: create(:user), params: { email: 'not-an-email' })).to be_failure
    end
  end

  describe Admin::DestroyUser do
    it 'deletes the user' do
      account = create(:user)
      expect(described_class.call(user: admin, record: account)).to be_success
      expect(User.exists?(account.id)).to be(false)
    end
  end
end
