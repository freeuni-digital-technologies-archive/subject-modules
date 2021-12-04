import {setEnv, config} from './config'

const {hw, slice, download, runOpts} = setEnv()
import { Submission, Drive } from "dt-types"
import {getSubmissions, downloadZip, createDrive, downloadAtInterval} from '../../classroom-api'
import {Result, WebTester} from 'website-tester'
import {Run, log} from './runs'
import {partitionResults} from './partitions'
import fs from 'fs'
import path from 'path'
import unzipper from 'unzipper'
import { Project, loadProjects } from './project'
import { assert } from 'console'
import { platform } from 'os'

// const tester = new WebTester(testPath)
const run = new Run(hw, runOpts)


// TODO:
// check all submissions have info.txt +
// build student -> project mapping +
// load and save the mapping +
// check all submissions projects have 4 participants +
// check all zip-s are the same?! 
// run tests +
// update template before mail 
// add database.js and config.js to tests + 

function getProjectsToReview(projects: Project[]): Map<string, Project[]>{
    let mp = new Map<string, Project[]>()
    projects.forEach(proj => {
        proj.reviewerIds.forEach(mailId => {
            if(!mp.has(mailId)){
                mp.set(mailId, []);
            }
            mp.get(mailId)?.push(proj);
        })
    })
    return mp
}

// const rankingFiles = ['design', 'bonus-difficulty', 'bonus-correctness']
const rankingFiles = ['design', 'bonus']

interface GivenRankings {
    design: string[],
    bonus: string[],
}

interface GottenRankings {
    design: number[], // places gotten
    bonus: number[], // places gotten
}

function parseRankings(dir: string): GivenRankings {
    let raw = rankingFiles.map(fileName => {
        let path = `${dir}/${fileName}.txt`
        let files = fs.readdirSync(dir)
        if(!files.includes(`${fileName}.txt`)) {
            if(!files.includes(`${fileName}.TXT`)) {
                throw `${fileName}.txt ვერ მოიძებნა`
            } else {
                path = `${dir}/${fileName}.TXT`   
            }
        }
        let content = fs.readFileSync(path,'utf8').split(/\r?\n/)
        if(content.length == 0) {
            throw `${fileName}.txt ცარიელია`
        }
        content = content.map(line => line.trim()).filter(line => line != '')
        if(content.length != 5) {
            throw `${fileName}.txt-ში ზუსტად 5 ხაზი უნდა იყოს`
        }
        return content
    })
    return {
        design: raw[0],
        bonus: raw[1],
    }
}

function addDesignScore(placesForProjects: Map<string, GottenRankings>, projId: string, rank: number) {
    if(!placesForProjects.has(projId)) {
        placesForProjects.set(projId, ({design:[], bonus: []}));
    }
    placesForProjects.get(projId)?.design.push(rank);
}

function addBonusScore(placesForProjects: Map<string, GottenRankings>, projId: string, rank: number) {
    if(!placesForProjects.has(projId)) {
        placesForProjects.set(projId, ({design:[], bonus: []}));
    }
    placesForProjects.get(projId)?.bonus.push(rank);
}

function designRankToScore(rank: number) {
    switch(rank) {
        case 1:
            return 10;
        case 2:
            return 9;
        case 3:
            return 7;
        case 4:
            return 3;
        case 5:
            return 2;
        default:
            console.log(`unknown rank: ${rank}`);
            process.exit(1)
    }
}

function calculateDesignScore(ranks: number[]): number{
    return ranks
            .map(designRankToScore)
            .reduce((a, b) => a + b, 0) 
                / ranks.length
}

function bonusRankToScore(rank: number) {
    switch(rank) {
        case 1:
            return 9;
        case 2:
            return 7;
        case 3:
            return 5;
        case 4:
            return 3;
        case 5:
            return 1;
        default:
            console.log(`unknown rank: ${rank}`);
            process.exit(1)
    }
}

function calculateBonusScore(ranks: number[]): number{
    return ranks
            .map(bonusRankToScore)
            .reduce((a, b) => a + b, 0) 
                / ranks.length
}

async function main() {
    let projects = loadProjects(path.resolve(__dirname, `../resources/`));
    console.log(projects)
    let uidMapping = new Map(projects.map(proj => [proj.uid, proj]));

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
    
    // console.log(mp);
    let allRankings: Map<string, GottenRankings> = new Map();
    for (let i = 0; i < submissions.length; i++) {
        try {
            results.push(await downloadSubmission(submissions[i], uidMapping, allRankings, drive, 0));
        } catch(e) {
            logError(submissions[i], e)
        }
    }
    console.log(allRankings)
    
    let designScores: Map<string, number> = new Map();
    let bonusScores: Map<string, number> = new Map();

    allRankings.forEach((ranks, projId) => {
        let designScore = calculateDesignScore(ranks.design)
        let bonusScore = calculateBonusScore(ranks.bonus)
        uidMapping.get(projId)?.students
            .forEach(id => {designScores.set(id, designScore)})
        uidMapping.get(projId)?.students
            .forEach(id => {bonusScores.set(id, bonusScore)})
        
        console.log(projId)
        console.log('--------')
        console.log(ranks.design)
        console.log('design score: ', designScore)
        console.log(ranks.bonus)
        console.log('bonus score: ', bonusScore)
        console.log('*********\n\n')
    })

    run.saveScores(designScores, 'final-design')
    run.saveScores(bonusScores, 'final-bonus')

    const output = partitionResults(results, hw)
    // run.saveProjectMapping(mp)
    run.saveRunInfo(output)
}

function checkRankingsProjects(rankings: GivenRankings, emailId: string, projects: Map<string, Project>): Result[] {
    [rankings.bonus, rankings.design].forEach(
        ranks => ranks.forEach(
            projectid => {
                let ok = projects.get(projectid)?.reviewerIds.includes(emailId)
                if(!ok) throw `პროექტი \"${projectid}\" არ მოიძებნა შენი შესაფასებელი პროექტების სიაში`;
            })
        )
    return [{
        passed: true,
        message: 'ყველაფერი წესრიგშია'
    }]
}


function saveRankings(ranks: GivenRankings, allRankings: Map<string, GottenRankings>, emailId: string, projects: Map<string, Project>) {
    let res = checkRankingsProjects(ranks, emailId, projects)
    ranks.design.forEach((projId, i) => {
        addDesignScore(allRankings, projId, i+1);
    })
    ranks.bonus.forEach((projId, i) => {
        addBonusScore(allRankings, projId, i+1);
    })
    return res
}

function downloadSubmission(submission: Submission, projects: Map<string, Project>, allRankings: Map<string, GottenRankings>, drive: Drive, index: number): Promise<Submission> {
    // if (!run.forceCheck(submission) && !submission.qualifies()) {
        // return new Promise(r => r(submission))
    // }
    const id = submission.emailId
    return downloadAtInterval(run.moveDir, submission, drive, index, true, false)
        .then((e: string) => log(e, `${id}: finished downloading`))
        .then(zipPath => unzipSubmission(submission, zipPath)
        .then(unzippedDir => findRootFile(unzippedDir)))
        .then(rakingsDir => parseRankings(rakingsDir))
        .then(rankings => saveRankings(rankings, allRankings, id, projects))
        .catch(e => [anyError(e)])
        .then((results: Result[]) => submission.addResults(results))
        // .then((dir: string) => tester.testSubmission(dir))
        // .catch(e => [zipError(e)])
        // .then((r: Result[]) => log(r, `${id}: finished testing`))
        // .then((results: Result[]) => submission.addResults(results))
        // .then(s => log(s, `${id}: ${submission.passed() ? 'passed' : 'failed'}`))
        // .catch((error: any) => logError(submission, error))
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

function anyError(e: any): Result {
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
    let files
    try {
        files = fs.readdirSync(p)    
    } catch (e) {
        throw 'ფიალი არ არის zip ფორმატში'
    }
    
    let tries = 0
    while (!files.includes('design.txt') && !files.includes('design.TXT')) {
        if (tries > 3) {
            throw "ვერ ვიპოვე design.txt"
        }
        let dirFound:boolean = false

        for(let i=0; i<files.length; i++) {
            try {
                let newp: string = `${p}/${files[i]}`
                files = fs.readdirSync(newp)
                p = newp
                dirFound = true
                break
            } catch (e) {
                // throw "file with unsupported format: " + files[0]
            }
        }
        if(!dirFound) {
            throw "ვერ ვიპოვე design.txt"
        }

        tries++

    }

    return p
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
