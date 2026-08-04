#!/usr/bin/env bash
set -o errexit

bundle install
bundle exec rails assets:precompile
bundle exec rails assets:clean

bundle exec rails db:prepare
bundle exec rails db:migrate:queue 2>/dev/null || bundle exec rails db:schema:load:queue 2>/dev/null || true
bundle exec rails db:migrate:cache 2>/dev/null || bundle exec rails db:schema:load:cache 2>/dev/null || true
bundle exec rails db:migrate:cable 2>/dev/null || bundle exec rails db:schema:load:cable 2>/dev/null || true
