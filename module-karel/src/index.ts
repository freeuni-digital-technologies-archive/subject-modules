import { setEnv, config, testerPath } from './config'
const  { hw, runOpts } = setEnv()

import { createDrive, getSubmissions, saveFile } from 'classroom-api'
import { Run } from './runs'
import { partitionResults } from './partitions'

import { getSubmissionsWithResults } from "./homeworkChecker";


const run = new Run(hw, runOpts)



async function main() {
    const drive = await createDrive();

    // TODO აქ ეს ორი await რაღაც სტრანნადაა და გადასახედია
    const submissions = await getSubmissionsWithResults(config.subject,hw,run, drive, saveFile, getSubmissions);

    const results = await Promise.all(submissions)
    const output = partitionResults(results, hw)

    run.saveRunInfo(output)
}


main()
