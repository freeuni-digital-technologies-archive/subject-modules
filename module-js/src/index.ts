import {setEnv, testConfigs, config} from './config'

const {hw, slice, download, runOpts} = setEnv()
import {getSubmissions, Submission, Drive, downloadZip, createDrive} from 'classroom-api'
import {Result, WebTester} from 'website-tester'
import {Run, log} from './runs'
import {partitionResults} from './partitions'
import fs from 'fs'
import unzipper from 'unzipper'
import * as pr from './pr'

const testPaths = testConfigs(hw.id, hw.filesToCheck)
// const tester = new WebTester(testPath)
const run = new Run(hw, runOpts)

// peer review mapping
let mp = new Map<string, string>();

async function main() {
    const drive = await createDrive()
    const submissions = await getSubmissions(config.subject, hw.name)
        .then(submissions => submissions.filter(s=>s.attachment!=undefined)) 
        .then(submissions => slice ? submissions.slice(0, slice) : submissions)
        .then(submissions => submissions
            .filter(s => !hw.skip?.includes(s.emailId) && (run.forceCheck(s) || run.newSubmission(s))))
        .then(s => log(s, `downloading ${s.filter(e => e.onTime()).length}`))
    //  .then(submissions => submissions.map((s, i) => downloadAndTest(s, drive, i)))
    let results: Submission[] = []
    // ew ew ew
    // Promise.map iS nOt A fUnCtIoN
    mp = run.loadProjectMapping()
    console.log(mp);
    for (let i = 0; i < submissions.length; i++) {
        const tester = new WebTester(testPaths)
        try {
            results.push(await downloadAndTest(submissions[i], drive, i, tester))
        } catch(e) {
            logError(submissions[i], e)
        }
        await tester.finish() // this await is very important
    }

    let projectStudentMapping:Map<string, string[]> = new Map();
    mp.forEach((project, mailId)=>{
        if(!projectStudentMapping.has(project)){
            projectStudentMapping.set(project, [])
        }
        projectStudentMapping.get(project)!.push(mailId)
    })

    projectStudentMapping.forEach((mailIds, project) => {
        if(mailIds.length > 4) {
            console.log('---- Exceeding: ----')
            console.log(project)
            console.log(mailIds)
            console.log('--------------------')
            results = results.map((s: Submission) => {
                if(mailIds.includes(s.emailId)){
                    s.results = [exceededError(project)]
                }
                return s
            })
        }
    })

    const output = partitionResults(results, hw)
    run.saveProjectMapping(mp)
    run.saveRunInfo(output)
}


function downloadAndTest(submission: Submission, drive: Drive, index: number, tester: WebTester): Promise<Submission> {
    if (!run.forceCheck(submission) && !submission.qualifies()) {
        return new Promise(r => r(submission))
    }
    const id = submission.emailId
    return downloadAtInterval(submission, drive)
        .then((e: string) => log(e, `${id}: finished downloading`))
        .then(newPath => unzipSubmission(submission, newPath))
        .then((dir: string) => {
            pr.peerReviewChecks(mp, submission, dir)
            return dir
        })
        .then((dir: string) => tester.testSubmission(dir))
        .catch(e => [anyError(e)])
        .then((r: Result[]) => log(r, `${id}: finished testing`))
        .then((results: Result[]) => submission.addResults(results))
        .then(s => calculateScore(s))
        .then(s => log(s, `${id}: ${submission.score}`))
        .catch((error: any) => logError(submission, error))
}

function getScore(r: Result): number {
    // აუ ფუ
    if (r.score) {
        return r.passed ? r.score : 0
    }
    return 0
}
function calculateScore(s: Submission): Submission {
    s.score = s.results.map(getScore).reduce((a, b) => a + b, 0)
    return s
}

function exceededError(project: string): Result {
    return {
        error: true,
        message: `პროექტი სახელად ${project} შეიცავს 4-ზე მეტ მონაწილეს.`
    }
}

function anyError(e: any): Result {
    console.log(e.toString())
    return {
        error: true,
        message: e.toString()
    }
}

function unzipSubmission(submission: Submission, path: string): Promise<string> {
    const dir = `${run.moveDir}/${submission.emailId}`
    try {
        fs.mkdirSync(dir)
    } catch (w) {
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
    let filesToBe = hw.filesToCheck || ['index']
    console.log(filesToBe)
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
    console.log('brozou', p)
    return p
}


function downloadAtInterval(submission: Submission, drive: Drive): Promise<string> {
    const attachment = submission.attachment!
    const fileName = attachment.title.includes(submission.emailId) ? attachment.title : submission.emailId + '.download'
    const id = attachment.id
    const path = `${run.moveDir}/${fileName}`
    return new Promise((resolve) => {
        // setTimeout(() => {
            if (download) {
                console.log(`${submission.emailId}: downloading to ${path}`)
                downloadZip(drive, id, path)
                    .then(() => resolve(path))
            } else {
                resolve(path)
            }
        // }, (index) * 200)
    })
}

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

main()
