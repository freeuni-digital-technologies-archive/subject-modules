import { expect } from 'chai'


import {Result, testSubmission} from 'codehskarel-tester'

const testPath = `${process.cwd()}/resources`
const solPath = `${process.cwd()}/test/files`

describe('hw4 test', () => {
	const testFile = `${testPath}/hw4tester.js`
	it('one test should run and it should pass', (done) => {
		console.log(testFile, `${solPath}/hw4.k`)
		testSubmission(testFile, `${solPath}/hw4.k`).then(results => {
			console.log(results)
			expect(results.every(r=>r.passed)).be.true;
			done()
		})
	})
    it('in case of a broken file it should report', (done) => {
        testSubmission(testFile, `${solPath}/hw3.k`).then(results => {
			console.log(results)
			expect(results.some(r=>!r.passed)).be.true;
			done()
		  })
    })
})
