# frozen_string_literal: true

FactoryBot.define do
  factory :membership do
    user
    restaurant
    role { :waiter }

    Membership.roles.each_key do |role_name|
      trait(role_name) { role { role_name } }
    end

    trait :inactive do
      active { false }
    end
  end
end
