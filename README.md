# subject-modules

All in one project for all digital technologies modules. 

## Requirements

1. node + npm installed
2. yarn installed 

## Setting up workspace

clone main repo
```
git clone https://github.com/freeuni-digital-technologies/subject-modules
```

clone all module repos with `fetch.sh` script
```
cd subject-modules
./fetch.sh
```

link all the modules together with yarn workspace
```
yarn
```

After this run build command in relevant modules:
```
cd my-module
yarn build
```

## adding new module
create repo at `freeuni-digital-technologies/my-new-module`

add "my-new-module" in package.json "workspaces"

run:
```
./fetch.sh
yarn
```




