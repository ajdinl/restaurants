# frozen_string_literal: true

# Production: only bootstraps a super admin from ENV. Never ships default passwords.
# Development: demo accounts share DEMO_PASSWORD (default "password123"). Test: nothing; specs build their own data.

if Rails.env.production?
  email = ENV.fetch('SUPER_ADMIN_EMAIL', nil)
  password = ENV.fetch('SUPER_ADMIN_PASSWORD', nil)
  abort('Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD to seed production.') if email.blank? || password.blank?

  User.find_or_create_by!(email:) do |user|
    user.full_name = ENV.fetch('SUPER_ADMIN_NAME', 'Super Admin')
    user.password = password
    user.platform_role = :super_admin
  end
  return
end

return unless Rails.env.development?

DEMO_PASSWORD = ENV.fetch('DEMO_PASSWORD', 'password123')

def demo_user(email, full_name, platform_role: nil)
  User.find_or_create_by!(email:) do |user|
    user.full_name = full_name
    user.password = DEMO_PASSWORD
    user.platform_role = platform_role
  end
end

def demo_restaurant(slug, **attributes)
  Restaurant.find_or_create_by!(slug:) { |restaurant| restaurant.assign_attributes(attributes) }
end

def add_member(restaurant, user, role)
  restaurant.memberships.find_or_create_by!(user:) { |membership| membership.role = role }
end

demo_user('admin@example.com', 'Super Admin', platform_role: :super_admin)
demo_user('moderator@example.com', 'Moderator Podrška', platform_role: :moderator)

demo = demo_restaurant('demo-restoran', name: 'Demo Restoran', address: 'Ferhadija 1', city: 'Sarajevo',
                                        phone: '+387 33 000 000', latitude: 43.859, longitude: 18.425, has_host: true)
bistro = demo_restaurant('bistro-most', name: 'Bistro Most', address: 'Onešćukova 2', city: 'Mostar',
                                        phone: '+387 36 000 000', latitude: 43.337, longitude: 17.815, has_host: false)

add_member(demo, demo_user('vlasnik@example.com', 'Vlasnik Demo'), :owner)
add_member(demo, demo_user('menadzer@example.com', 'Menadžer Demo'), :manager)
add_member(demo, demo_user('host@example.com', 'Ulazni Menadžer'), :host)
add_member(demo, demo_user('konobar@example.com', 'Konobar Demo'), :waiter)
add_member(demo, demo_user('kuhinja@example.com', 'Kuhinja Demo'), :kitchen)

# Works in both restaurants, so they get the restaurant picker after sign-in.
two_jobs = demo_user('dva.posla@example.com', 'Dva Posla')
add_member(demo, two_jobs, :waiter)
add_member(bistro, two_jobs, :manager)

puts "Seeded #{User.count} users and #{Restaurant.count} restaurants. Password for all demo accounts: #{DEMO_PASSWORD}"
