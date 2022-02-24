#!/usr/bin/env bash
mkdir -p ../data
yarn install
# requires package.json workspaces to be listed in dependency order
node getList.js | xargs -I {} sh -c "cd {} && yarn build"
