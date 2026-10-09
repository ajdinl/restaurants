# frozen_string_literal: true

# Run using bin/ci

CI.run do
  step 'Setup', 'bin/setup --skip-server'

  step 'Style: Ruby', 'bundle exec rubocop'
  step 'I18n: bs/en in sync', 'bundle exec i18n-tasks missing && bundle exec i18n-tasks unused'
  step 'Tests: RSpec', 'bundle exec rspec'

  step 'Frontend: lint', 'npm --prefix frontend run lint'
  step 'Frontend: types', 'npm --prefix frontend run typecheck'
  step 'Frontend: format', 'npm --prefix frontend run format:check'
  step 'Frontend: bs/en messages in sync', 'npm --prefix frontend run i18n:check'
  step 'Frontend: build', 'npm --prefix frontend run build'

  step 'Security: Gem audit', 'bin/bundler-audit'
  step 'Security: Brakeman code analysis', 'bin/brakeman --quiet --no-pager --exit-on-warn --exit-on-error'

  # Optional: set a green GitHub commit status to unblock PR merge.
  # Requires the `gh` CLI and `gh extension install basecamp/gh-signoff`.
  # if success?
  #   step "Signoff: All systems go. Ready for merge and deploy.", "gh signoff"
  # else
  #   failure "Signoff: CI failed. Do not merge or deploy.", "Fix the issues and try again."
  # end
end
