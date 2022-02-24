#!/usr/bin/env bash
mkdir -p ../data
yarn
# requires package.json workspaces to be listed in dependency order
node getList.js | xargs -I {} sh -c "cd {} && yarn build"
sh -c "cd classroom-api && yarn getlist"
