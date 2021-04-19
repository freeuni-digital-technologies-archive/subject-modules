const fs = require('fs')
const { workspaces } =  JSON.parse(fs.readFileSync('package.json')) // აქ path შეიძლება დაჭირდეს
console.log(workspaces.join('\n'))
