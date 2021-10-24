import { setEnv, config } from './config'
const { hw, runOpts } = setEnv()
import { getSubmissions } from 'classroom-api'
import { Run } from './runs'
import { partitionResults } from './partitions'

import {sliceSubmissions, filterSubmissions, logDownloadingSubmissions, finishSubmissions } from "./integration";

const run = new Run(hw, runOpts)

async function main() {
    const submissions = await getSubmissions(config.subject, hw.name)
        .then(sliceSubmissions)
        .then(filterSubmissions)
        .then(logDownloadingSubmissions)
        .then(finishSubmissions)

    const results = await Promise.all(submissions)
    const output = partitionResults(results, hw)

    run.saveRunInfo(output)
}


main()
