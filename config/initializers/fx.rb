# frozen_string_literal: true

# Tables (generated search columns, indexes) depend on f_unaccent, so schema.rb must create it first.
Fx.configure do |config|
  config.dump_functions_at_beginning_of_schema = true
end
