import { setEnv, config, testerPath } from './config'
const  { hw, runOpts } = setEnv()

import { createDrive, getSubmissions, saveFile } from 'classroom-api'
import { Run } from './runs'
import { partitionResults } from './partitions'

import {sliceSubmissions, filterSubmissions, logDownloadingSubmissions, finishSubmissions } from "./integration";


const run = new Run(hw, runOpts)

const testPath = testerPath(hw.id);


async function main() {
    const drive = await createDrive();

    const submissions = await getSubmissions(config.subject, hw.name)
        .then(submissions => sliceSubmissions(submissions,run.opts.slice))
        .then(submissions => filterSubmissions(submissions, run, hw))
        .then(logDownloadingSubmissions)
        .then(submissions => finishSubmissions(submissions,testPath,drive, run, saveFile))

    const results = await Promise.all(submissions)
    const output = partitionResults(results, hw)

    run.saveRunInfo(output)
}


main()
