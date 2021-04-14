# subject-modules 

All in one project for all digital technologies modules. 

## Requirements

1. node + npm installed
2. yarn installed 

## Setting up workspace

Clone main repo
```
git clone https://github.com/freeuni-digital-technologies/subject-modules
```

Clone all module repos with `fetch.sh` script
```
cd subject-modules
./fetch.sh
```

Link all the modules together with yarn workspace
```
yarn
```

After this run build command in relevant modules:
```
cd my-module
yarn build
```

## Adding new module
Create repo at `freeuni-digital-technologies/my-new-module`

Add "my-new-module" in package.json's "workspaces" property. 

run:
```
./fetch.sh
yarn
```



# Testing Submissions Locally

## Google API Credentials:
### Generate credentials.json
ცოტა საჩალიჩო გასაკეთებელია და რორამე მე მითხარით და ჩემსას მოგცემთ ან:

Generate by following this:

https://developers.google.com/workspace/guides/create-credentials

Put credentials.json in classrom-api/

### Get student list(TO BE REMOVED)

```bash
cd classroom-api
yarn build
yarn getlist -p ./ -c "შესავალი ციფრულ ტექნოლოგიებში 2021 გაზაფხული"
```
If run first time this will ask you to follow a link to generate token.json. Ask me if you have problems. 

### Create `data` folder

* Create data folder anwhere and create `submissions` folder inside.
* Copy data folder path to `module-karel/src/runs.ts`. 
```js
...
const data_path = `/home/khokho/work/dt/guide/subject-modules/data`
...
```

### Test Karel hw1
Build module and all its dependencies. 
```bash
cd jskarel
yarn build
cd ../codehskarel-tester
yarn build
cd ../module-karel
yarn build
```
#### Run HW1 Tests
```bash
cd module-karel
yarn start --hw hw1
```
Logs and Homeworks will all be inside `data` folder.
To check what emails would be sent you can run:
```bash
yarn notify --hw hw1 --trial true
```

## Sending emails

TODO
```
