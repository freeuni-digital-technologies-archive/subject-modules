node getList.js | xargs -I {} bash -c 'bash -c "cd {} && git pull" || git clone git@github.com:freeuni-digital-technologies/{}.git'
