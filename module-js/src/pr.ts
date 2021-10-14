import fs from 'fs'
import {Submission} from 'classroom-api'
import detectCharacterEncoding from 'detect-character-encoding'


export class Project {
    id: string
    students: string[]
    bonus: string
    title: string
    //hash maybe?
    constructor(id: string, students: string[], bonus: string, title: string) {
        this.id = id
        this.students = students
        this.bonus = bonus
        this.title = title
    }
}


export function parseProject(dir: string): Project {
    let files = fs.readdirSync(dir)
    if(!files.includes('info.txt') && !files.includes('info.txt.txt')) {
        throw 'info.txt ვერ მოიძებნა'
    }
    let infoFile = `${dir}/info.txt`;
    if(!files.includes('info.txt')) {
		infoFile = `${dir}/info.txt.txt`;
	 }
    const fileBuffer = fs.readFileSync(infoFile);
    let encoding = detectCharacterEncoding(fileBuffer);
	 let content: string[] = []
	 try {
		 content = fs.readFileSync(infoFile, encoding!.encoding).split(/\r?\n/)
	 } catch(e) {
		 content = fs.readFileSync(infoFile, 'utf8').split(/\r?\n/)
	 }
    if(content.length == 0) {
        throw 'info.txt ვერ მოიძებნა'   
    }

    let projectName = content[0];
    let bonusDescription = content.length > 1 ? content.slice(1).join('\n') : 'უბონუსო';
    
    let proj: Project;
    proj = new Project(projectName, [], bonusDescription, projectName);
    return proj
}


export function peerReviewChecks(mp: Map<string, string>, submission: Submission, dir: string) {
    let proj = parseProject(dir);
    console.log(proj);
    mp.set(submission.emailId, proj.title);
}
