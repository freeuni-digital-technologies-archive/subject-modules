import fse from "fs-extra";
import {ProjectGroup} from "../modules/groupProject";

export class ProjectsInfo {
    private projectGroups: ProjectGroup[]

    constructor(private projectsGroupFile: string, private projectsDir: string) {
        this.projectGroups = ProjectsInfo.readProjectGroups(projectsGroupFile)
    }

    save() {
        fse.writeFileSync(this.projectsGroupFile, JSON.stringify(this.projectGroups))
    }

    findTeamWithId(id: string) {
        return this.projectGroups.find(e => e.id === id)
    }

    findTeamWithName(teamName: string) {
        return this.projectGroups.find(e => e.name === teamName)
    }

    findTeamWithMember(emailId: string) {
        return this.projectGroups.find(e => e.members.includes(emailId))
    }

    changedTeam(emailId: string, teamName: string) {
        const existing = this.findTeamWithMember(emailId)
        return existing && teamName !== existing.name
    }

    setupNewProject(teamName: string, emailId: string, dir: string) {
        const id = getNewId(this.projectGroups.map(e => e.id))
        const destination = `${this.projectsDir}/${id}`
        this.projectGroups.push({
            id: id,
            dir: destination,
            name: teamName,
            members: [emailId]
        })
        try {
            fse.copySync(dir, destination)
        } catch (e) {
            fse.mkdirSync(this.projectsDir)
            fse.copySync(dir, destination)
        }
        this.save()
        return destination
    }

    addMemberToTeam(teamName: string, emailId: string, dir: string) {
        const existingProject = this.findTeamWithName(teamName)!
        if (!existingProject.members.includes(emailId)) {
            existingProject.members.push(emailId)
        }
        const destination = existingProject.dir
        // @ts-ignore
        fse.rmSync(destination, {recursive: true})
        fse.copySync(dir, destination)
        this.save()
        return existingProject.dir
    }

    removeFromTeam(emailId: string) {
        const alreadyInTeam = this.findTeamWithMember(emailId)!
        alreadyInTeam.members = alreadyInTeam.members.filter(m => m !== emailId)
        if (alreadyInTeam.members.length < 1) {
            fse.removeSync(alreadyInTeam.dir)
            this.projectGroups = this.projectGroups.filter(p => p.id == alreadyInTeam.id)
        }
        this.save()
    }

    static readProjectGroups(path: string): ProjectGroup[] {
        try {
            return JSON.parse(fse.readFileSync(path, 'utf-8'))
        } catch (e) {
            return []
        }
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