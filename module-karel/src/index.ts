import { setEnv, config, testerPath, HwConfig } from './config'
import { createDrive, getSubmissions, saveFile } from 'classroom-api'
import { Run } from './runs'
import { partitionResults } from './partitions'

import {sliceSubmissions, filterSubmissions, logDownloadingSubmissions, finishSubmissions } from "./integration";

const  { hw, slice, download, runOpts } = setEnv()

const run = new Run(hw, runOpts)

const testPath = testerPath(hw.id);


async function main() {
    console.log("Before Create Drive");
    const drive = await createDrive();
    console.log("After Create Drive");


    const submissions = await getSubmissions(config.subject, hw.name)
        .then(submissions => sliceSubmissions(submissions,slice))
        .then(submissions => filterSubmissions(submissions, run, hw))
        .then(logDownloadingSubmissions)
        .then(submissions => finishSubmissions(submissions,testPath,drive, run, download, saveFile))

    const results = await Promise.all(submissions)
    const output = partitionResults(results, hw)

    run.saveRunInfo(output)
}


main()
