import { getArgs } from './cli'
import { mergeResults } from './partitions'
import fs from 'fs'


// last Checked result
function main() {
    const { hw, runOpts } = getArgs()

    const finalResults = mergeResults(hw, runOpts)
    const output = `${process.cwd()}/results/${hw.id}.json`
    fs.writeFileSync(output, JSON.stringify(finalResults, null, '\t'))
}


main()
