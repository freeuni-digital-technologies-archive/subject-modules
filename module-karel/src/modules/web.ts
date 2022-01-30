import { SubjectModule } from '../types/module'

import { Submission, Result } from "dt-types";
import { Drive } from "classroom-api"
import { Run, log } from "../runs";
import { WebTester } from "website-tester"
import fs from 'fs'
import unzipper from 'unzipper'

import path from 'path'
import { HwConfig } from '../homework'
import * as fse from "fs-extra";


export const zipFormatError = 'დავალება არ არის zip ფაილში ან ატვირთული zip ფაილი არ იხსნება. თავიდან შექმენი ზიპი და ატვირთე. <a href="https://freeuni-digital-technologies.github.io/homework/web_hws.html#ვებ-დავალებების-ატვირთვის-წესი">ინსტრუქცია სურათებით</a>'
export const fileNotFoundError = "დავალების ფაილები ვერ მოიძებნა."

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


function prepareSubmission(unzipPath: string, testPath: string): string {
	const dir  = findRootFile(unzipPath)
    const p = `${dir}/index.html`
    const contents = fs.readFileSync(p, 'utf-8')
    const relativePath = path.relative(dir, testPath)
    const scriptTag = `<script src="${relativePath}"></script>`
    let replaced = contents.replace(/<div id="scripts">.*<\/div>/g, scriptTag)
    if (replaced == contents) {
        replaced = contents.replace(/<div id="scripts">(.|\s)*<\/div>/g, scriptTag)
    }
    if (replaced == contents) {
        replaced = contents.replace(/<div id='scripts'>(.|\s)*<\/div>/g, scriptTag)
    }
    fs.writeFileSync(p, replaced)
    return dir
}


function downloadAtInterval(submission: Submission, drive: Drive,  index: number, run: Run, saveFile: any): Promise<string> {
    const attachment = submission.attachment!
    const fileName = attachment.title
    const id = attachment.id
    // TODO კარელზეც მგონი სჯობს რომ დირექტორიები იყოს emailId-ებით
    // და რამე სტანდარტული სახელი დაერქვას. რატომ ვინახავთ
    // სტუდენტის დარქმეული სახელით??
    const path = `${run.moveDir}/${fileName}`

    return new Promise((resolve, reject) => {
        if (run.opts.download) {
            if (process.env.NODE_ENV === 'production')
                console.log(`${submission.emailId}: downloading`)
            saveFile(drive, id, path)
                .then(() => unzipSubmission(submission, path, run.moveDir))
                .then((unzipDir: string) => resolve(unzipDir))
                .catch((e: string) => reject(e))
        } else {
            resolve(getUnzipDir(submission, run.moveDir))
        }
    })
}


export const moduleWeb: SubjectModule = {
	downloadAtInterval: downloadAtInterval,
	testSubmission: testSubmission,
	prepareSubmission: prepareSubmission,
	asynchronousTest: false,
    emailTemplates: {}
}



function getUnzipDir(submission: Submission, moveDir: string): string {
    return `${moveDir}/${submission.emailId}`
}

function unzipSubmission(submission: Submission, path: string, moveDir: string): Promise<string> {
    const dir = getUnzipDir(submission, moveDir)
    try {
        fs.mkdirSync(dir)
    } catch (w) {
        fse.removeSync(dir);
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
