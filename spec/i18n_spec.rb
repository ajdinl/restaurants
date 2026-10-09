# frozen_string_literal: true

require 'i18n/tasks'

RSpec.describe 'I18n' do
  let(:i18n) { I18n::Tasks::BaseTask.new }

  it 'has every key in both bs and en' do
    missing = i18n.missing_keys
    expect(missing).to be_empty, "Missing translations:\n#{missing.inspect}"
  end

  it 'has no unused keys' do
    unused = i18n.unused_keys
    expect(unused).to be_empty, "Unused translations:\n#{unused.inspect}"
  end
end
