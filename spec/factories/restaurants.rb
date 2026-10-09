# frozen_string_literal: true

FactoryBot.define do
  factory :restaurant do
    sequence(:name) { |n| "Restoran #{n}" }
    city { 'Sarajevo' }

    trait :suspended do
      status { :suspended }
    end
  end
end
