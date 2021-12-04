#!/usr/bin/env sh

# specified in dependency order </3

function main() {
	submodules=$(node ./scripts/getList.js)

	for submodule in ${submodules[@]}; do
		cd $submodule > /dev/null
		build $submodule
		cd ..
	done
}

function build() {
	submodule=$1
	if [[ ! -d "lib" ]] || [[ ! -z "$(git status . --porcelain)" ]] 
	then
		echo "building $submodule"
		yarn build
	fi
}

main
