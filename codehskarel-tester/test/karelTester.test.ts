import { expect } from 'chai'

import { KarelTester } from '../src/karelTester'

const path = `${__dirname}/files`

describe('simple test case', () => {
    const testFile = `${path}/simpleTest.js`
    const tester = new KarelTester(testFile)
    it('one test should run and it should pass', () => {
        const [result] = tester.testSubmission(`${path}/simple.k`)
        expect(result.passed).be.true
        expect(result.message).eql("karel should go to 3x1")
    })
    it('in case of a broken file it should report', () => {
        const [result] = tester.testSubmission(`${path}/broken.k`)
        expect(result.error).be.true
        expect(result.message).eql("there is a problem with the file")
    })
})


describe('superkarel test case', () => {
    const testFile = `${path}/superTest.js`
    const tester = new KarelTester(testFile)
    it('test should run and pass', () => {
        const [result] = tester.testSubmission(`${path}/super.k`)
        expect(result.passed).be.true
        expect(result.message).eql("karel should go to 1x2")
    })
    it('in case of a broken file it should report', () => {
        const [result] = tester.testSubmission(`${path}/broken.k`)
        expect(result.error).be.true
        expect(result.message).eql("there is a problem with the file")
    })
})

describe('integration test case', () => {
    const testFile = `${path}/integrationTest.js`
    const tester = new KarelTester(testFile)
    it('should work with passing and failing tests', () => {
        const results = tester.testSubmission(`${path}/integration.k`)
        expect(results).length(3)
        expect(results.filter(e => e.passed)).length(2)
        const error = results.filter(e => !e.passed)[0]
        expect(error.message).include('karel should finish on 2x2')
    })
})

// TODO: not working
describe('buggy program', () => {
    const testFile = `${path}/buggyTest.js`
    const tester = new KarelTester(testFile)
    it('should handle bugs in the program', () => {
        const [ result ] = tester.testSubmission(`${path}/simple.k`)
        expect(result.error).be.true
        expect(result.message).eql("there is a bug in the program")
        expect(result.details).contain('there is a wall in front of Karel')
    })
})
