# frozen_string_literal: true

class EnableSearchExtensions < ActiveRecord::Migration[8.1]
  def change
    enable_extension 'pg_trgm'
    enable_extension 'unaccent'
    create_function :f_unaccent
  end
end
