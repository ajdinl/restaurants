# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::Workspace::BaseController, type: :controller do
  controller(described_class) do
    requires_module :inventory

    def index
      skip_policy_scope
      render_success({ ok: true })
    end
  end

  include Devise::Test::ControllerHelpers

  let(:restaurant) { create(:restaurant) }
  let(:owner) { create(:membership, :owner, restaurant:).user }

  before do
    routes.draw { get 'anonymous/:restaurant_slug' => 'api/v1/workspace/base#index' }
    request.headers['Accept'] = 'application/json'
    sign_in owner
  end

  it 'returns 404 when the module is off' do
    get :index, params: { restaurant_slug: restaurant.slug }
    expect(response).to have_http_status(:not_found)
  end

  it 'runs the action when the module is on' do
    restaurant.update!(modules: %w[inventory])
    get :index, params: { restaurant_slug: restaurant.slug }
    expect(response).to have_http_status(:ok)
  end

  it 'rejects unknown module keys at class load' do
    expect { Class.new(described_class) { requires_module :teleport } }.to raise_error(ArgumentError)
  end
end
