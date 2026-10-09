# frozen_string_literal: true

module Workspace
  class DashboardController < BaseController
    def show
      authorize %i[workspace dashboard], :show?
    end
  end
end
