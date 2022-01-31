
import { Submission } from "dt-types";
import { Drive } from 'classroom-api'
import { Run, log } from "./runs";

import path from 'path'
import { HwConfig } from './homework'

import { Result } from "website-tester" // TODO dt-types
import { SubjectModule } from './types/module'
import { moduleWeb, zipFormatError, fileNotFoundError } from './modules/web'
import { moduleKarel } from './modules/karel'
import { moduleProject, filesNotFoundError, teamNameNotFoundError } from "./modules/groupProject";

// TODO this should be a private member when refactored to class
// @ts-ignore
let subjectModule: SubjectModule = null // :|

/* Combine all steps into one function */
export async function getSubmissionsWithResults(configSubject: string, hw: HwConfig, run: Run, drive: Drive, saveFile: any, getSubmissions: (a: string, b: string) => Promise<Submission[]>){
    // TODO ეს ფუნქცია კონფიგიდან არ კითხულობს ტესტpath-ს
    // TODO დასატესტია ასე თუ მუშაობს კარელზე
    setSubmissionModule(hw)
    const testPath = path.resolve(path.dirname(hw.configPath), hw.testFileName)

    const submissions = await getSubmissions(configSubject, hw.name)
    // TODO ეს სამი ერთ ფუნქციაში და სტრუქტურა უფრო გამოიკვეთოს
        .then(submissions => sliceSubmissions(submissions,run.opts.slice))
        .then(submissions => filterSubmissions(submissions, run, hw))
        .then(submissions => filterSubmissionsByAttachment(submissions))
        .then(logDownloadingSubmissions)
        .then(submissions => processSubmissions(submissions,testPath,drive, run, saveFile));

    return submissions
}

const existingModules: any = {
    'web': moduleWeb,
    'karel': moduleKarel,
    'groupProject': moduleProject
}

export function setSubmissionModule(hw: HwConfig) {
    if (Object.keys(existingModules).includes(hw.module)) {
        subjectModule = existingModules[hw.module]
    } else {
        console.log(`module ${hw.module} not found`)
        process.exit(1)
    }
}


/*
    Downloads submission and tests it.
    It finds test file in 'testerPath' path.
    It also logs if the file has been downloaded or has been tested

    Returns the result for the current submission, if any error occurs, catches it and logs it too
*/
async function downloadAndTest(submission: Submission, drive: Drive, index: number, testPath: string,run : Run, saveFile: any): Promise<Submission> {
    if (!run.forceCheck(submission) && !submission.qualifies()) {
        return new Promise(r => r(submission))
    }
    const id = submission.emailId
    return subjectModule.downloadAtInterval(submission, drive, index, run, saveFile)
         .then((e: string) => log(e, `${id}: finished downloading`))
         .then((newPath: string) => subjectModule.prepareSubmission(newPath, testPath))
         .then((newPath: string) => subjectModule.testSubmission(testPath, newPath))
         .then((r: Result[]) => log(r, `${id}: finished testing`))
         .then((results: Result[]) => submission.addResults(results))
        .catch((error: any) => logError(submission, error))
}


/*
    Simply: logs the given error
    TODO ესენი მერე გავიტანოთ
*/
function logError(submission: Submission, error: any) {
    const knownErrors = [zipFormatError, fileNotFoundError, filesNotFoundError, teamNameNotFoundError]
    if (knownErrors.includes(error)) {
        submission.incorrectFormat = true
        submission.results.push({
            error: true,
            details: error
        })
        return submission
    }
    submission.results.push({
        error: true,
        message: "crash",
        details: error
    })
    log({}, `error: ${submission.emailId}, ${error}`)
    submission.crashed = true
    return submission
}


/*
    DECOMPOSITION SECTION

    src: index.ts -> function main()

    Divided by 4 steps
    
*/


/*
    Step 1) 
        Slicing submissions after getting them from classrom-api module
*/
export function sliceSubmissions(submissions: Submission[], slice: number | undefined){
    return slice ? submissions.slice(0,slice) : submissions;
}

/*
    Step 2) 
        Filtering sliced submissions for further operations
*/
export function filterSubmissions(submissions: Submission[], run: Run, hw: HwConfig){
    return submissions.filter(
        s => (!hw.skip?.includes(s.emailId) && (run.forceCheck(s) || run.newSubmission(s)))
    );
}

/*
    Step 3) 
        Log submissions after filtering
*/

export function logDownloadingSubmissions(submissions: Submission[]){
    //log(s, `downloading ${s.filter(e => e.onTime()).length}`

    if (submissions.length < 1) {
        console.log("no new submissions")
        process.exit(0)
    }
    const text = submissions.filter(submission => {
        return submission.onTime();
    }).length
    return log(submissions,`downloading ${text}`);
}

function filterSubmissionsByAttachment(submissions: Submission[]): Submission[]{
    let filtered: Submission[] =  submissions.filter(submission => {
        let result = typeof submission.attachment !== 'undefined';
        return result;
    })
    return filtered;
}

/*
    Step 4) 
        Validate submissions with attachments, download and test them
*/

export async function processSubmissions(submissions: Submission[], testPath: string, drive: Drive, run: Run, saveFile: any): Promise<Submission[]> { 
    if (subjectModule.asynchronousTest) {
        return Promise.all(submissions.map((submission, index) => {
            return downloadAndTest(submission,drive, index, testPath, run, saveFile)
        }));
    }
    let index = 0
    const results = []
    for (let submission of submissions) {
        const r = await downloadAndTest(submission,drive, index, testPath, run, saveFile)
        results.push(r)
    }
    return results
}


