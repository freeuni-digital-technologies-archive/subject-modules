import { expect } from 'chai'
import {moduleProject, ProjectGroup, teamNameNotFoundError } from "../src/modules/groupProject";
import * as path from "path";
import * as fs from "fs";
import * as fse  from "fs-extra";
import {ProjectsInfo} from "../src/types/projectsInfo";

const testDir = path.resolve(__dirname, './files/groupProject/')
const tempDir = path.resolve(__dirname, './tempData')
const testSubmission = moduleProject.testSubmission

beforeEach(() => {
    try {
        fs.mkdirSync(tempDir)
    } catch(e) {
        fse.removeSync(tempDir);
        fs.mkdirSync(tempDir)
    }
})
afterEach(() => {
    fse.removeSync(tempDir);
})

describe("prepare submission", () => {

    it("check team name", () => {
        const p = () => prepareSubmissions(['/akhel21'])
        expect(p).to.throw(teamNameNotFoundError)
    })

    it("save projects.json file", () => {
        const projectGroups = prepareSubmissions(['team1_member1'])
        expect(projectGroups[0].name).equal('team1')
        expect(projectGroups[0].members).eql(['team1_member1'])
    })
    it("generate ids with 3 digit numbers", () => {
        const projectGroups = prepareSubmissions(['team1_member1'])
        expect(projectGroups[0].id).length('group'.length + 3)
    })

    it(`move files to projects subdirectory`, () => {
        const groups = ['team1_member1', 'team2_member1']
        const projectGroups = prepareSubmissions(groups)
        projectGroups.forEach(group => {
            const projectFiles = `${tempDir}/files/${group.id}`
            expect(fs.existsSync(projectFiles), group.id).to.be.true
        })
    })

    it(`add existing member to the group`, () => {
        const students = ['team1_member1', 'team1_member2', 'team2_member1']
        const projectGroups = prepareSubmissions(students)
        expect(projectGroups).length(2)
        const team1 = projectGroups.find(p => p.name === 'team1' )
        expect(team1.members).length(2)
        expect(team1.members).eql(['team1_member1', 'team1_member2'])
        const team2 = projectGroups.find(p => p.name === 'team2')
        expect(team2.members).length(1)
        expect(team2.members).eql(['team2_member1'])
    })


})

describe("resubmissions", () => {
    it(`remove member from old group if submits new files for new group`, () => {
        const students = ['team1_member1', 'team1_member2']
        prepareSubmissions(students)
        const updatedSubmissions = prepareSubmissions(['resubmitted/team1_member1'])
        const team1 = findTeam(updatedSubmissions,'team1').members
        expect(team1).eql(['team1_member2'])
        const team3 = findTeam(updatedSubmissions,'team3').members
        expect(team3).eql(['team1_member1'])
    })

    it(`delete old group and its files if group changes name (ie no members are left in the group`, () => {
        const students = ['team1_member1', 'team1_member2']
        const submissions = prepareSubmissions(students)
        const team1 = findTeam(submissions, 'team1')
        const newSubmissions = ['resubmitted/team1_member1', 'resubmitted/team1_member2']
        const updatedSubmissions = prepareSubmissions(newSubmissions)
        expect(fs.existsSync(team1.dir)).to.be.false

    //    TODO
    //     expect(findTeam(updatedSubmissions, 'team1')) undefined
    })

})

describe("test submission", () => {
    it("include team members in the message", async () => {
        const firstGroup = prepareSubmissions(['team1_member1'])
        const results0 = await testSubmission(tempDir, firstGroup[0].dir)
        expect(results0[0].message.includes('team1')).to.be.true
        expect(results0[0].message.includes('member1')).to.be.true
        expect(results0[0].message.includes('member2')).to.be.false

        const students = ['team1_member2', 'team2_member1']
        const projectGroups = prepareSubmissions(students)

        const results1 = await testSubmission(tempDir, projectGroups[0].dir)
        expect(results1[0].message.includes('team1')).to.be.true
        expect(results1[0].message.includes('member1')).to.be.true
        expect(results1[0].message.includes('member2')).to.be.true
        const results2 = await testSubmission(tempDir, projectGroups[1].dir)
        expect(results2[0].message.includes('team2')).to.be.true
        expect(results2[0].message.includes('member1')).to.be.true
    })
})


function prepareSubmissions(projectNames: string[]): ProjectGroup[] {
    projectNames.forEach(p =>
        moduleProject.prepareSubmission(testDir + '/' + p, tempDir)
    )
    return ProjectsInfo.readProjectGroups(`${tempDir}/projects.json`)
}

function findTeam(projects: ProjectGroup[], teamName: string) {
    return projects.find(p => p.name === teamName)
}