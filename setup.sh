node getList.js | xargs -I {} sh -c "cd {} && yarn install && yarn test"
