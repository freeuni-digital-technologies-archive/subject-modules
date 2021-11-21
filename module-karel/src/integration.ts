
import { Submission, Drive } from "classroom-api";
import { Run, log } from "./runs";
// TODO მოკლედ ყველა ცვლილება ისე იქნება რომ ბოლოს 
// if დაემატოს და ამ ორიდან ამოარჩიოს, და unzip-იც რამე პარამეტრი იქნება
// import { Result, testSubmission } from "codehskarel-tester";
import { Result, WebTester } from "website-tester"
import { testerPath } from "./config";
import { HwConfig } from './homework'
import fs from 'fs'
import unzipper from 'unzipper'
import path from 'path'

const zipFormatError = 'დავალება არ არის zip ფაილში'
const fileNotFoundError = "დავალების ფაილები ვერ მოიძებნა"
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
    return downloadAtInterval(submission, drive, index, run, saveFile)
         .then((e: string) => log(e, `${id}: finished downloading`))
         .then((newPath: string) => findRootFile(newPath))
         // .then((newPath: string) => testSubmission(testPath, newPath))
         .then((newPath: string) => prepareSubmission(newPath, testPath))
         .then((newPath: string) => testSubmission('', newPath))
         .then((r: Result[]) => log(r, `${id}: finished testing`))
         .then((results: Result[]) => submission.addResults(results))
        .catch((error: any) => logError(submission, error))
}



async function testSubmission(testPath: string, dir: string): Promise<Result[]> {
    const tester = new WebTester({targetFiles: ['index'], testsLocation: ''})
    return tester.testSubmission(dir, false)
        .then(async (result) => {
            await tester.finish()
            return result
        })
	.catch(async (e) => {
	    await tester.finish()
	    throw e
	    })
}


function prepareSubmission(dir: string, testPath: string): string {
    const p = `${dir}/index.html`
    const contents = fs.readFileSync(p, 'utf-8')
    const relativePath = path.relative(dir, testPath)
    const scriptTag = `<script src="${relativePath}"></script>`
    let replaced = contents.replace(/<div id="scripts">.*<\/div>/g, scriptTag)
    if (replaced == contents) {
        replaced = contents.replace(/<div id="scripts">(.|\s)*<\/div>/g, scriptTag)
    }
    fs.writeFileSync(p, replaced)
    return dir
}


/*
    This is used for downloading and saving the submission.
    Saving path is included.

*/
function downloadAtInterval(submission: Submission, drive: Drive,  index: number, run: Run, saveFile: any): Promise<string> {
    const attachment = submission.attachment!
    const fileName = attachment.title
    const id = attachment.id
    // TODO კარელზეც მგონი სჯობს რომ დირექტორიები იყოს emailId-ებით
    // და რამე სტანდარტული სახელი დაერქვას. რატომ ვინახავთ
    // სტუდენტის დარქმეული სახელით??
    const path = `${run.moveDir}/${fileName}`

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (run.opts.download) {
                console.log(`${submission.emailId}: downloading`)
                saveFile(drive, id, path)
                    .then(() => unzipSubmission(submission, path, run.moveDir))
                    .then((unzipDir: string) => resolve(unzipDir))
                    .catch((e: string) => reject(e))
            } else {
                resolve(getUnzipDir(submission, run.moveDir))
            }
        }, (index) * 200)

    })
}
// function downloadAtInterval(submission: Submission, index: number): Promise<string> {
//     const fileName = submission.attachment!.title
//     return new Promise((resolve) => {
//         if (download) {
//             setTimeout(() => {
//                 console.log(`${submission.emailId}: downloading`)
//                 resolve(downloadAssignment({
//                     downloadDir: '/home/ia/Downloads',
//                     downloadUrl: submission.attachment!.downloadUrl,
//                     fileName: fileName,
//                     moveDir: moveDir,
//                     timeout: 500
//                 }))
//             }, (index) * 1000)
//         } else {
//             resolve(`${moveDir}/${fileName}`)
//         }
//     })
// }

/*
    Simply: logs the given error
*/
function logError(submission: Submission, error: any) {
    const knownErrors = [zipFormatError, fileNotFoundError]
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

    const text = submissions.filter(submission => {
        submission.onTime();
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

export async function finishSubmissions(submissions: Submission[], testPath: string, drive: Drive, run: Run, saveFile: any): Promise<Submission[]> {
    
    let submissionsWithAttachments: Submission[] = filterSubmissionsByAttachment(submissions);
    // სინქრონულად იქნება აღარაა ტაიმაუტი საჭირო
    let index = 0
    const results = []
    for (let submission of submissions) {
        const r = await downloadAndTest(submission,drive, index, testPath, run, saveFile)
        results.push(r)
    }
    return results
    // return submissionsWithAttachments.map((submission, index) => {
    //     return downloadAndTest(submission,drive, index, testPath, run, saveFile)
    // });
}



/* Combine all steps into one function */
export async function getSubmissionsWithResults(configSubject: string, hw: HwConfig, run: Run, drive: Drive, saveFile: any, getSubmissions: (a: string, b: string) => Promise<Submission[]>){
    // TODO ეს ფუნქცია კონფიგიდან არ კითხულობს ტესტpath-ს
    // const testPath = testerPath(hw.id);
    // TODO დასატესტია ასე თუ მუშაობს კარელზე
    const testPath = path.resolve(hw.configPath, hw.testFileName)

    const submissions = await getSubmissions(configSubject, hw.name)
        .then(submissions => sliceSubmissions(submissions,run.opts.slice))
        .then(submissions => filterSubmissions(submissions, run, hw))
        .then(logDownloadingSubmissions)
        .then(submissions => finishSubmissions(submissions,testPath,drive, run, saveFile));

    return submissions
}

function getUnzipDir(submission: Submission, moveDir: string): string {
    return `${moveDir}/${submission.emailId}`
}

function unzipSubmission(submission: Submission, path: string, moveDir: string): Promise<string> {
    const dir = getUnzipDir(submission, moveDir)
    try {
        fs.mkdirSync(dir)
    } catch (w) {
        fs.rmdirSync(dir, {recursive: true})
        fs.mkdirSync(dir)
    }
    return fs.createReadStream(path)
        .pipe(unzipper.Extract({path: dir}))
        .promise()
        .then(() => dir)
        .catch((e) => {throw zipFormatError})
}

function findRootFile(dir: string): string {
    let p = dir
    let files = fs.readdirSync(p)
    let tries = 0
    // let filesToBe = hw.filesToCheck || ['index']
    let filesToBe = ['index']
    // TODO ასე მგონია find ფუნქცია იარსებებს ჯავასკრიპტში:)
    while (filesToBe.some(file => !files.includes(`${file}.html`))) {
        if (tries > 3) {
            throw fileNotFoundError
        }
          // saves us minutes of our lives
          files = files.filter(f => f !== '__MACOSX');
        try {
            p = `${p}/${files[0]}`
            files = fs.readdirSync(p)
        } catch (e) {
            throw fileNotFoundError
            //throw "file with unsupported format: " + files[0]
        }
        tries++
    }
    return p
}
