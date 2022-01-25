import { expect } from 'chai'
import {moduleProject, ProjectGroup, readProjectGroups, teamNameNotFoundError } from "../src/modules/groupProject";
import * as path from "path";
import * as fs from "fs";

const testDir = path.resolve(__dirname, './files/groupProject/')
const tempDir = path.resolve(__dirname, './tempData')
const testSubmission = moduleProject.testSubmission

beforeEach(() => {
    try {
        fs.mkdirSync(tempDir)
    } catch(e) {
        // @ts-ignore
        fs.rmdirSync(tempDir, {recursive: true});
        fs.mkdirSync(tempDir)
    }
})
afterEach(() => {
    // @ts-ignore
    fs.rmSync(tempDir, {recursive: true});
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
    return readProjectGroups(tempDir)
}