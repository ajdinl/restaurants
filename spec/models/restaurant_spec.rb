# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Restaurant do
  subject { build(:restaurant) }

  describe 'associations' do
    it { is_expected.to have_many(:memberships).dependent(:destroy) }
    it { is_expected.to have_many(:users).through(:memberships) }
    it { is_expected.to have_many(:domain_events).dependent(:delete_all) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(120) }
    it { is_expected.to validate_numericality_of(:latitude).is_in(-90..90).allow_nil }
    it { is_expected.to validate_numericality_of(:longitude).is_in(-180..180).allow_nil }

    it 'rejects slugs with invalid characters' do
      expect(build(:restaurant, slug: 'Bad Slug!')).not_to be_valid
    end

    it 'rejects duplicate slugs' do
      create(:restaurant, slug: 'taken')
      expect(build(:restaurant, slug: 'taken')).not_to be_valid
    end

    it 'rejects unknown modules' do
      expect(build(:restaurant, modules: %w[qr_menu teleport])).not_to be_valid
    end

    it 'enforces known modules in the database' do
      restaurant = create(:restaurant)
      expect { restaurant.update_column(:modules, %w[teleport]) }.to raise_error(ActiveRecord::StatementInvalid) # rubocop:disable Rails/SkipsModelValidations
    end

    it 'requires at least one supported content language' do
      expect(build(:restaurant, content_locales: [])).not_to be_valid
      expect(build(:restaurant, content_locales: %w[de])).not_to be_valid
    end

    it 'enforces content languages in the database' do
      restaurant = create(:restaurant)
      expect { restaurant.update_column(:content_locales, []) }.to raise_error(ActiveRecord::StatementInvalid) # rubocop:disable Rails/SkipsModelValidations
    end

    it 'rejects unknown time zones' do
      expect(build(:restaurant, time_zone: 'Mars/Olympus')).not_to be_valid
    end
  end

  describe 'slug generation' do
    it 'transliterates Bosnian characters' do
      expect(create(:restaurant, name: 'Ćevabdžinica Željo').slug).to eq('cevabdzinica-zeljo')
    end

    it 'appends a suffix when the slug is taken' do
      create(:restaurant, name: 'Most')
      expect(create(:restaurant, name: 'Most').slug).to eq('most-2')
    end
  end

  it 'defaults to active in Europe/Sarajevo' do
    restaurant = create(:restaurant)
    expect(restaurant).to be_active
    expect(restaurant.time_zone).to eq('Europe/Sarajevo')
  end

  it 'uses the persisted slug in URLs while an edit is invalid' do
    restaurant = create(:restaurant, slug: 'original')
    restaurant.slug = 'Bad Slug!'
    expect(restaurant.to_param).to eq('original')
  end

  it 'knows which modules are on' do
    restaurant = build(:restaurant, modules: %w[qr_menu])
    expect(restaurant.module?(:qr_menu)).to be(true)
    expect(restaurant.module?('inventory')).to be(false)
  end

  it 'treats the first content language as primary' do
    expect(build(:restaurant, content_locales: %w[en bs]).primary_content_locale).to eq('en')
  end

  it 'keeps a version history tagged with its own id' do
    restaurant = create(:restaurant)
    restaurant.update!(phone: '033 123 456')
    expect(restaurant.versions.last).to have_attributes(event: 'update', restaurant_id: restaurant.id)
    expect(restaurant.versions.last.object_changes).to include('phone' => [nil, '033 123 456'])
  end
end
