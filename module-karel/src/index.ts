import { config } from './config'
import { getArgs } from './cli'

import { createDrive, getSubmissions, saveFile, StudentList, Authenticator } from 'classroom-api'
import { Run } from './runs'
import { partitionResults } from './partitions'

import { getSubmissionsWithResults } from "./homeworkChecker";



async function main() {
    const  { hw, runOpts } = getArgs()
    const run = new Run(hw, runOpts)
    const auth = new Authenticator(config.CLASSROOM_TOKEN_PATH, config.CLASSROOM_CREDENTIALS_PATH)
    const drive = await createDrive(auth);
    const students = new StudentList(config.STUDENTS_DATA_PATH);
    // დროებით წავა
    const getSubjectSubmissions = (s: string, hw: string) => getSubmissions(s, hw, students, auth)

    // TODO აქ ეს ორი await რაღაც სტრანნადაა და გადასახედია
    const submissions = await getSubmissionsWithResults(config.subject,hw,run, drive, saveFile, getSubjectSubmissions);

    const results = await Promise.all(submissions)
    const output = partitionResults(results, hw)

    run.saveRunInfo(output)
}


main()
    .then(e => console.log("done."))
