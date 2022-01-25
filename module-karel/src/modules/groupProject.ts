import { SubjectModule } from '../module'

import { Result, WebTester } from "website-tester"
import fs from 'fs'

import fse from 'fs-extra'
import path from 'path'
import {moduleWeb} from "./web";
import { parse } from 'node-html-parser'

export const moduleProject: SubjectModule = {
    downloadAtInterval: moduleWeb.downloadAtInterval,
    testSubmission: testSubmission,
    prepareSubmission: prepareSubmission,
    asynchronousTest: false,
    emailTemplates: {}
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


function prepareSubmission(unzipPath: string, projectsPath : string): string {
    const dir  = findRootFile(unzipPath)
    // სამწუხაროდ აქ აუცილებელია რომ დირექტორიის სახელი emailId იყოს
    const emailId = path.basename(dir)
    const p = `${dir}/index.html`
    const about = parse(fs.readFileSync(`${dir}/about.html`, 'utf-8'))
    const teamName = about.querySelector('span#team-name')
    if (!teamName || teamName.innerText.trim().length < 1) {
        throw teamNameNotFoundError
    }
    addSubmissionToGroup(dir, emailId, teamName.innerText, projectsPath)
    // const contents = fs.readFileSync(p, 'utf-8')
    return dir
}

export interface ProjectGroup {
    id: string,
    name: string,
    members: string[]
}

function addSubmissionToGroup(dir: string, emailId: string, teamName: string, projectsPath: string) {
    const projectFilesPath = projectsPath + '/files'
    const projectGroups = readProjectGroups(projectsPath)
    const existingProject = projectGroups.find(e => e.name === teamName)
    if (existingProject) {
        existingProject.members.push(emailId)
    } else {
        const id = getNewId(projectGroups.map(e => e.id))
        projectGroups.push({
            id: id,
            name: teamName,
            members: [emailId]
        })
        try {
            fse.copySync(dir, `${projectFilesPath}/${id}`)
        } catch (e) {
            fs.mkdirSync(projectFilesPath)
            fse.copySync(dir, `${projectFilesPath}/${id}`)
        }

    }
    fs.writeFileSync(projectsPath + '/projects.json', JSON.stringify(projectGroups))
}

export function readProjectGroups(projectsPath: string): ProjectGroup[] {
    const projectGroupsPath = projectsPath + '/projects.json'
    try {
        return JSON.parse(fs.readFileSync(projectGroupsPath, 'utf-8'))
    } catch (e) {
        return []
    }
}
function getNewId(existingIds: string[]) {
    let id = generateNewId()
    while (existingIds.includes(id)) {
        id = generateNewId()
    }
    return id
}

function generateNewId() {
    return 'group' +  Math.floor(Math.random() * 900 + 100)
}

function findRootFile(dir: string): string {
    let p = dir
    let files = fs.readdirSync(p)
    let tries = 0
    // let filesToBe = hw.filesToCheck || ['index']
    let filesToBe = ['index', 'about']
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



export const zipFormatError = 'დავალება არ არის zip ფაილში'
export const fileNotFoundError = "დავალების ფაილები (index.html, about.html) ვერ მოიძებნა"
export const teamNameNotFoundError = 'about.html-ში აუცილებელია ეწეროს team-name'