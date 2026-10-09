# frozen_string_literal: true

module Pagination
  DEFAULT_PER_PAGE = 25
  MAX_PER_PAGE = 100

  private

  def render_paginated(serializer, scope)
    per_page = params.fetch(:per_page, DEFAULT_PER_PAGE).to_i.clamp(1, MAX_PER_PAGE)
    page = [params.fetch(:page, 1).to_i, 1].max
    total = scope.count
    records = scope.limit(per_page).offset((page - 1) * per_page)

    render_success(serializer.render(records), meta: { page:, per_page:, total:, total_pages: (total.to_f / per_page).ceil })
  end
end
