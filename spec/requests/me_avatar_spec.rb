# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Me avatar' do
  let(:user) { create(:user) }
  let(:headers) { auth_headers_for(user, locale: 'en').except('Content-Type') }

  def upload(file)
    patch api_v1_me_avatar_path, params: { avatar: file }, headers: headers
  end

  it 'uploads a photo and returns its URL' do
    upload(fixture_file_upload('avatar.png', 'image/png'))
    expect(response).to have_http_status(:ok)
    expect(user.reload.avatar).to be_attached
    expect(json.dig('data', 'avatar_url')).to start_with('http://localhost:3001/rails/active_storage/blobs/')
  end

  it 'rejects SVG even when it claims to be a PNG' do
    upload(fixture_file_upload('avatar.svg', 'image/png'))
    expect(response).to have_http_status(:unprocessable_content)
    expect(json['errors']).to include(a_hash_including('field' => 'avatar'))
    expect(user.reload.avatar).not_to be_attached
  end

  it 'rejects files over 2 MB' do
    png = "\x89PNG\r\n\x1A\n".b + ("\0" * (2.megabytes + 1))
    upload(Rack::Test::UploadedFile.new(StringIO.new(png), 'image/png', true, original_filename: 'big.png'))
    expect(response).to have_http_status(:unprocessable_content)
    expect(error_messages.join).to include('2 MB')
  end

  it 'removes the photo' do
    user.avatar.attach(io: file_fixture('avatar.png').open, filename: 'avatar.png')
    delete api_v1_me_avatar_path, headers: headers
    expect(response).to have_http_status(:no_content)
    expect(user.reload.avatar).not_to be_attached
  end

  it 'returns 400 without a file' do
    patch api_v1_me_avatar_path, headers: headers
    expect(response).to have_http_status(:bad_request)
  end
end
