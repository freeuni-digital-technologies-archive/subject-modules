import { setEnv, testerPath, config } from './config'
import { getSubmissions, createDrive } from 'classroom-api'
import { Run, log } from './runs'
import { partitionResults } from './partitions'

import { downloadAndTest } from "./indexHelper";

const { hw, slice, runOpts } = setEnv()
const run = new Run(hw, runOpts)

async function main() {
    const drive = await createDrive()
    const submissions = await getSubmissions(config.subject, hw.name)
        .then(submissions => slice ? submissions.slice(0, slice) : submissions)
        .then(submissions => submissions
            .filter(s => !hw.skip?.includes(s.emailId) && (run.forceCheck(s) || run.newSubmission(s))))
        .then(s => log(s, `downloading ${s.filter(e => e.onTime()).length}`))
        .then(submissions => submissions.filter(s=>s.attachment!=undefined).map((s, i) => downloadAndTest(s, drive, i)))
    const results = await Promise.all(submissions)
    const output = partitionResults(results, hw)

    run.saveRunInfo(output)
}


main()
