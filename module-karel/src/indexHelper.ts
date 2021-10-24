
import { setEnv, testerPath, config } from "./config";
import { Submission, Drive, saveFile } from "classroom-api";
import { Run, log } from "./runs";
import { Result, testSubmission } from "codehskarel-tester";

const { hw, download, runOpts } = setEnv();

const testPath = testerPath(hw.id);
const run = new Run(hw, runOpts)

export function downloadAndTest(submission: Submission, drive: Drive, index: number): Promise<Submission> {
    if (!run.forceCheck(submission) && !submission.qualifies()) {
        return new Promise(r => r(submission))
    }
    const id = submission.emailId
    return downloadAtInterval(submission, drive, index)
         .then((e: string) => log(e, `${id}: finished downloading`))
         .then((newPath: string) => testSubmission(testPath, newPath))
         .then((r: Result[]) => log(r, `${id}: finished testing`))
         .then((results: Result[]) => submission.addResults(results))
        .catch((error: any) => logError(submission, error))
}

function downloadAtInterval(submission: Submission, drive: Drive,  index: number): Promise<string> {
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
