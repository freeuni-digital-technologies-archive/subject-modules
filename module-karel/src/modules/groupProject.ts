import { SubjectModule } from '../types/module'

import { Result } from "website-tester"
import fs from 'fs'

import fse from 'fs-extra'
import path from 'path'
import { moduleWeb } from "./web";
import { parse } from 'node-html-parser'


/**
 * ამ მოდულის მიზანია გუნდის სხვადასხვა წევრების ატვირთული
 * ფაილებით გუნდებად დააჯგუფოს სტუდენტები და ახალ დირექტორიაში
 * მხოლოდ გუნდების ფაილები იყოს.
 */
export const moduleProject: SubjectModule = {
    downloadAtInterval: moduleWeb.downloadAtInterval,
    testSubmission: testSubmission,
    prepareSubmission: prepareSubmission,
    asynchronousTest: true,
    emailTemplates: {}
}

async function testSubmission(testPath: string, dir: string): Promise<Result[]> {
    const projectGroups = readProjectGroups(testPath)
    const project = projectGroups.find(p => p.dir === dir)
    const teamName = project!.name
    const teamMates = project!.members
    return [{
        passed: true,
        message: `${teamName}: ${teamMates.join(', ')}`,
    }]
}

function prepareSubmission(unzipPath: string, projectsPath : string): string {
    const dir  = findRootFile(unzipPath)
    // სამწუხაროდ აქ აუცილებელია რომ დირექტორიის სახელი emailId იყოს
    const emailId = path.basename(unzipPath)
    const about = parse(fs.readFileSync(`${dir}/about.html`, 'utf-8'))
    const teamName = about.querySelector('span#team-name')
    if (!teamName || teamName.innerText.trim().length < 1) {
        throw teamNameNotFoundError
    }
    return addSubmissionToGroup(dir, emailId, teamName.innerText, projectsPath)
}

export interface ProjectGroup {
    id: string,
    name: string,
    dir: string,
    members: string[]
}

function addSubmissionToGroup(dir: string, emailId: string, teamName: string, projectsPath: string) {
    const projectFilesPath = projectsPath + '/files'
    const projectGroups = readProjectGroups(projectsPath)
    const alreadyInTeam = projectGroups.find(e => e.members.includes(emailId))
    if (alreadyInTeam && teamName !== alreadyInTeam.name) {
        alreadyInTeam.members = alreadyInTeam.members.filter(m => m !== emailId)
        if (alreadyInTeam.members.length < 1) {
            fse.removeSync(alreadyInTeam.dir)
        //    TODO remove key too
        }
    }

    const existingProject = projectGroups.find(e => e.name === teamName)

    if (existingProject) {
        existingProject.members.push(emailId)
        fs.writeFileSync(projectsPath + '/projects.json', JSON.stringify(projectGroups))
        return existingProject.dir
    } else {
        const id = getNewId(projectGroups.map(e => e.id))
        const destination = `${projectFilesPath}/${id}`
        projectGroups.push({
            id: id,
            dir: destination,
            name: teamName,
            members: [emailId]
        })
        try {
            fse.copySync(dir, destination)
        } catch (e) {
            fs.mkdirSync(projectFilesPath)
            fse.copySync(dir, destination)
        }
        fs.writeFileSync(projectsPath + '/projects.json', JSON.stringify(projectGroups))
        return destination
    }
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
            throw filesNotFoundError
        }
        // saves us minutes of our lives
        files = files.filter(f => f !== '__MACOSX');
        try {
            p = `${p}/${files[0]}`
            files = fs.readdirSync(p)
        } catch (e) {
            throw filesNotFoundError
            //throw "file with unsupported format: " + files[0]
        }
        tries++
    }
    return p
}



export const filesNotFoundError = `დავალების ფაილები სრულად ვერ მოიძებნა. აუცილებელია 
ატვირთული იყოს index.html და about.html (<strong>ორივე, ზუსტად ამ სახელებით</strong>). 
შემდეგი ატვირთვისთვის წაიკითხე პროექტის ინსტრუქცია. გაითვალისწინე, რომ ეს ორივე ფაილი
უნდა იყოს ერთ ფოლდერში (ქვეფოლდერში არა).`
export const teamNameNotFoundError = `about.html-ში აუცილებელია შევსებული იყოს span id-ით team-name. 
    შევსებული ნიშნავს რომ span-ში უნდა ეწეროს. ელემენტს id არ შეუცვალო`