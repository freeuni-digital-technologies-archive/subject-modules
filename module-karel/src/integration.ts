
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


/*
    Downloads submission and tests it.
    It finds test file in 'testerPath' path.
    It also logs if the file has been downloaded or has been tested

    Returns the result for the current submission, if any error occurs, catches it and logs it too
*/

async function testSubmission(testPath: string, dir: string): Promise<Result[]> {
    return new Promise((resolve) => {
        const t = setInterval(() => {        
            const tester = new WebTester({targetFiles: ['index.html'], testsLocation: ''})
            tester.testSubmission(dir, false)
                .then(result => {
                    tester.finish()
                    clearTimeout(t)
                    resolve(result)
                })
                .catch(e => {})
            // const result = await tester.testSubmission(dir, false)
            // await tester.finish()
            // resolve(result)
    }, Math.round(Math.random()*2000) + 2000) 
    })

}

function downloadAndTest(submission: Submission, drive: Drive, index: number, testPath: string,run : Run, saveFile: any): Promise<Submission> {
    if (!run.forceCheck(submission) && !submission.qualifies()) {
        return new Promise(r => r(submission))
    }
    const id = submission.emailId
    return downloadAtInterval(submission, drive, index, run, saveFile)
         .then((e: string) => log(e, `${id}: finished downloading`))
         // .then((newPath: string) => testSubmission(testPath, newPath))
         .then((newPath: string) => testSubmission('', newPath))
         .then((r: Result[]) => log(r, `${id}: finished testing`))
         .then((results: Result[]) => submission.addResults(results))
        .catch((error: any) => logError(submission, error))
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
                    .then(() => resolve(path))
                    .catch((e: string) => reject(e))
            } else {
                resolve(path)
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

export async function finishSubmissions(submissions: Submission[], testPath: string, drive: Drive, run: Run, saveFile: any){
    
    let submissionsWithAttachments: Submission[] = filterSubmissionsByAttachment(submissions);
    return submissionsWithAttachments.map((submission, index) => {
        return downloadAndTest(submission,drive, index, testPath, run, saveFile)
    });
}



/* Combine all steps into one function */
export async function getSubmissionsWithResults(configSubject: string, hw: HwConfig, run: Run, drive: Drive, saveFile: any, getSubmissions: (a: string, b: string) => Promise<Submission[]>){
    // TODO ეს ფუნქცია კონფიგიდან არ კითხულობს ტესტpath-ს
    const testPath = testerPath(hw.id);

    const submissions = await getSubmissions(configSubject, hw.name)
        .then(submissions => sliceSubmissions(submissions,run.opts.slice))
        .then(submissions => filterSubmissions(submissions, run, hw))
        .then(logDownloadingSubmissions)
        .then(submissions => finishSubmissions(submissions,testPath,drive, run, saveFile));

    return submissions
}


function unzipSubmission(submission: Submission, path: string, moveDir: string): Promise<string> {
    const dir = `${moveDir}/${submission.emailId}`
    try {
        fs.mkdirSync(dir)
    } catch (w) {
        fs.rmdirSync(dir, {recursive: true})
        fs.mkdirSync(dir)
    }
    return fs.createReadStream(path)
        .pipe(unzipper.Extract({path: dir}))
        .promise()
        .catch((e) => {throw 'დავალება არ არის zip ფაილში'})
        .then(() => findRootFile(dir))
}

function findRootFile(dir: string): string {
    let p = dir
    let files = fs.readdirSync(p)
    let tries = 0
    // let filesToBe = hw.filesToCheck || ['index']
    let filesToBe = ['index']
    console.log(filesToBe)
    // TODO ასე მგონია find ფუნქცია იარსებებს ჯავასკრიპტში:)
    while (filesToBe.some(file => !files.includes(`${file}.html`))) {
        if (tries > 3) {
            throw "დავალების ფაილები ვერ მოიძებნა"
        }
          // saves us minutes of our lives
          files = files.filter(f => f !== '__MACOSX');
        try {
            p = `${p}/${files[0]}`
            files = fs.readdirSync(p)
        } catch (e) {
            throw "დავალების ფაილები ვერ მოიძებნა"
            //throw "file with unsupported format: " + files[0]
        }
        tries++
    }
    return p
}