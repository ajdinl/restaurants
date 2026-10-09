# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    full_name { Faker::Name.name }
    sequence(:email) { |n| "user#{n}@example.com" }
    password { 'password123' }

    trait :super_admin do
      platform_role { :super_admin }
    end

    trait :moderator do
      platform_role { :moderator }
    end
  end
end
