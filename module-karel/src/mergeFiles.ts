import { setEnv } from './config'
import { mergeResults } from './partitions'
import fs from 'fs'

const { hw, runOpts } = setEnv()

// last Checked result
function main() {
    const finalResults = mergeResults(hw, runOpts)
    const output = `${process.cwd()}/results/${hw.id}.json`
    fs.writeFileSync(output, JSON.stringify(finalResults, null, '\t'))
}


main()
