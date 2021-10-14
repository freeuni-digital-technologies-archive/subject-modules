import fs from 'fs'
import path from 'path'
var hri = require('human-readable-ids').hri;

import { authenticate } from 'classroom-api'
import {google} from 'googleapis'

function genId(): string {
    return hri.random();
}

export function saveProjects(dir: string, projects: Project[]) {
    let filePath = dir + '/projects.json';
    const contents = JSON.stringify(projects);
    fs.writeFileSync(filePath, contents);
}

export function loadProjects(dir: string): Project[] {
    let filePath = dir + '/projects.json';
    let files = fs.readdirSync(dir)
    if(!files.includes('projects.json')) {
        return [];
    }
    const contents = fs.readFileSync(filePath, 'utf-8');
    let projects: any[] = JSON.parse(contents);
    return projects.map(jsonObj => {
        let proj = new Project([], '', '', '')
        proj.uid = jsonObj.uid
        proj.students = jsonObj.students
        proj.bonus = jsonObj.bonus
        proj.title = jsonObj.title
        proj.zipFileToSend = jsonObj.zipFileToSend
        proj.driveLink = jsonObj.driveLink
        proj.projectDir = jsonObj.projectDir
        proj.reviewerIds = jsonObj.reviewerIds
        return proj
    })
}


export class Project {
    uid: string
    students: string[]
    bonus: string
    title: string
    zipFileToSend?: string
    driveLink?: string
    projectDir: string
    reviewerIds: string[]



    constructor(students: string[], bonus: string, title: string, projectDir: string) {
        this.uid = genId()
        this.students = students
        this.bonus = bonus
        this.title = title
        this.projectDir = projectDir
        this.reviewerIds = []
    }

    addReviewer(reviewerId: string) {
        this.reviewerIds.push(reviewerId)
    }


    async uploadFile() {
        let uploadFile = this.zipFileToSend!
        const auth = await authenticate()
        const drive = google.drive({version: 'v3', auth});
        console.log(drive)
        const fileMetadata = {
            name: `${this.uid}.zip`,
            mimeType: 'application/zip',
        };
        const media = {
            mimeType: 'application/zip',
            body: fs.createReadStream(uploadFile)
        };
        const res = await drive.files.create({
            requestBody: fileMetadata,
            media: media
        });
        var permissions = {
            'value': 'default',
            'type': 'anyone',
            'role': 'reader'
        };
        await drive.permissions.create({
            fileId: res.data.id!,
            requestBody: permissions
        })
        console.log(res.data);
        this.driveLink = `https://drive.google.com/file/d/${res.data.id}/view`
    }


    checkStudentAmountLegal(): boolean {
        return this.students.length <= 4
    }
}
