import { setEnv, config, testerPath } from './config'
const  { hw, runOpts } = setEnv()

import { createDrive, getSubmissions, saveFile } from 'classroom-api'
import { Run } from './runs'
import { partitionResults } from './partitions'

import {sliceSubmissions, filterSubmissions, logDownloadingSubmissions, finishSubmissions, getSubmissionsWithResults } from "./integration";


const run = new Run(hw, runOpts)



async function main() {
    const drive = await createDrive();

    const submissions = await getSubmissionsWithResults(config.subject,hw,run, drive);

    const results = await Promise.all(submissions)
    const output = partitionResults(results, hw)

    run.saveRunInfo(output)
}


main()
