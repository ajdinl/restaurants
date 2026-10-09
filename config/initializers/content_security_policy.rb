# frozen_string_literal: true

# The API serves JSON only, so nothing may be loaded or framed from its responses.
Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src :none
    policy.frame_ancestors :none
  end
end
