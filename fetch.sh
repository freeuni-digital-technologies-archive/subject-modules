node getList.js | xargs -I {} bash -c 'bash -c "cd {} && git pull" || git clone https://github.com/freeuni-digital-technologies/{}'
