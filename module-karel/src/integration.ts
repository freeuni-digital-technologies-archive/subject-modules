
import { Submission, Drive, saveFile } from "classroom-api";
import { Run, log } from "./runs";
import { Result, testSubmission } from "codehskarel-tester";
import { HwConfig } from "./config";


/*
    Downloads submission and tests it.
    It finds test file in 'testerPath' path.
    It also logs if the file has been downloaded or has been tested

    Returns the result for the current submission, if any error occurs, catches it and logs it too
*/
function downloadAndTest(submission: Submission, drive: Drive, index: number, testPath: string,run : Run, download: boolean, saveFile: any): Promise<Submission> {
    if (!run.forceCheck(submission) && !submission.qualifies()) {
        return new Promise(r => r(submission))
    }
    console.log("Download And Test here");
    const id = submission.emailId
    return downloadAtInterval(submission, drive, index, run, download, saveFile)
         .then((e: string) => log(e, `${id}: finished downloading`))
         .then((newPath: string) => testSubmission(testPath, newPath))
         .then((r: Result[]) => log(r, `${id}: finished testing`))
         .then((results: Result[]) => submission.addResults(results))
        .catch((error: any) => logError(submission, error))
}

/*
    This is used for downloading and saving the submission.
    Saving path is included.

*/
function downloadAtInterval(submission: Submission, drive: Drive,  index: number, run: Run, download: boolean, saveFile: any): Promise<string> {
    console.log("Download at interval here");
    const attachment = submission.attachment!
    const fileName = attachment.title
    const id = attachment.id
    const path = `${run.moveDir}/${fileName}`
    return new Promise((resolve) => {
        setTimeout(() => {
            if (download) {
                console.log(`${submission.emailId}: downloading`)
                saveFile(drive, id, path)
                    .then(() => resolve(path))
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
    console.log("SLice here");
    return slice ? submissions.slice(0,slice) : submissions;
}

/*
    Step 2) 
        Filtering sliced submissions for further operations
*/
export function filterSubmissions(submissions: Submission[], run: Run, hw: HwConfig){
    console.log("Filter here");
    return submissions.filter(
        s => !hw.skip?.includes(s.emailId) && (run.forceCheck(s) || run.newSubmission(s))
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

/*
    Step 4) 
        Validate submissions with attachments, download and test them
*/

export async function finishSubmissions(submissions: Submission[], testPath: string, drive: Drive, run: Run, download: boolean, saveFile: any){
    let submissionsWithAttachments: Submission[] = submissions.filter(submission => {
        return submission.attachment != undefined;
    });

    log("","Finish here");
    
    return submissionsWithAttachments.map((submission, index) => {
        return downloadAndTest(submission,drive, index, testPath, run, download, saveFile)
    });
}
