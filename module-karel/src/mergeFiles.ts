import { setEnv, testerPath, config } from './config'
const { hw, slice, download, runOpts } = setEnv()

import { Run, log } from './runs'
import {Submission} from "classroom-api";
import fs from 'fs'
// last Checked result
function main() {
    const latestRun = new Run(hw, runOpts)
    let finalResults: Submission[] = []
    for (let i = latestRun.lastRun; i > 0; i--) {
        const run = new Run(hw, runOpts, i)
        const results = run.previousRunInfo
        const merged = Object.values(results).flat()
        const newResult = (e: Submission) => !finalResults.find(r => r.emailId == e.emailId)
        const res = merged.filter(newResult)
        finalResults = finalResults.concat(res)
    }
    const output = `${process.cwd()}/results/${hw.id}.json`
    fs.writeFileSync(output, JSON.stringify(finalResults, null, '\t'))
}


main()
