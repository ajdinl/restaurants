# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Translatable do
  # A throwaway tenant table; DDL is transactional in Postgres, so it disappears after each example.
  let(:model) do
    Class.new(ApplicationRecord) do
      self.table_name = 'translatable_things'
      include MultiTenant
      include Translatable

      translates :name, required: true
      translates :description

      def self.name
        'TranslatableThing'
      end
    end
  end

  let(:restaurant) { create(:restaurant, content_locales: %w[bs en]) }

  before do
    ActiveRecord::Base.connection.create_table(:translatable_things, id: :uuid, temporary: true) do |t|
      t.uuid :restaurant_id, null: false
      t.jsonb :name, null: false, default: {}
      t.jsonb :description, null: false, default: {}
    end
    ActsAsTenant.current_tenant = restaurant
  end

  def build_thing(**attributes)
    model.new(name: { 'bs' => 'Ćevapi' }, **attributes)
  end

  describe '#name_in' do
    it 'returns the requested locale' do
      thing = build_thing(name: { 'bs' => 'Ćevapi', 'en' => 'Cevapi' })
      expect(thing.name_in(:en)).to eq('Cevapi')
    end

    it 'falls back to the primary locale, then to any translation' do
      expect(build_thing.name_in(:en)).to eq('Ćevapi')
      restaurant.update!(content_locales: %w[en bs])
      expect(build_thing(name: { 'bs' => 'Sarma', 'en' => '' }).name_in(:en)).to eq('Sarma')
    end

    it 'uses the current locale by default' do
      thing = build_thing(name: { 'bs' => 'Ćevapi', 'en' => 'Cevapi' })
      I18n.with_locale(:en) { expect(thing.name_in).to eq('Cevapi') }
    end
  end

  describe 'validation' do
    it 'accepts translations in the restaurant languages' do
      expect(build_thing(description: { 'bs' => 'Opis', 'en' => 'Description' })).to be_valid
    end

    it 'requires the primary locale for required attributes' do
      expect(build_thing(name: { 'en' => 'Cevapi' })).not_to be_valid
    end

    it 'allows optional attributes to be empty' do
      expect(build_thing(description: {})).to be_valid
    end

    it 'rejects languages the restaurant does not use' do
      restaurant.update!(content_locales: %w[bs])
      thing = build_thing(name: { 'bs' => 'Ćevapi', 'en' => 'Cevapi' })
      expect(thing).not_to be_valid
      expect(thing.errors).to be_of_kind(:name, :invalid)
    end

    it 'rejects non-hash and non-string values' do
      expect(build_thing(description: 'Opis')).not_to be_valid
      expect(build_thing(description: { 'bs' => { 'x' => 1 } })).not_to be_valid
    end

    it 'limits the length of each translation' do
      expect(build_thing(description: { 'bs' => 'a' * (Translatable::MAX_LENGTH + 1) })).not_to be_valid
    end
  end
end
