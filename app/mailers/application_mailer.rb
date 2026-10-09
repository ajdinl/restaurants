# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: ENV['MAILER_FROM'].presence || 'no-reply@example.com'
  layout 'mailer'
end
