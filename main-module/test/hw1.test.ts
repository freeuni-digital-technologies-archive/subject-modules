import { expect } from 'chai'


import { testSubmission} from 'codehskarel-tester'
import { Result } from 'dt-types'

const testPath = `${__dirname}/resources`
const solPath = `${__dirname}/test/files`

describe.skip('hw1 test', () => {
	const testFile = `${testPath}/hw1tester.js`
	it('one test should run and it should pass', (done) => {
		testSubmission(testFile, `${solPath}/hw1.k`).then(results => {
			expect(results.every(r=>r.passed)).be.true;
			done()
		})
	})
//    it('in case of a broken file it should report', () => {
//        const [result] = tester.testSubmission(`${path}/broken.k`)
//        expect(result.error).be.true
//        expect(result.message).eql("there is a problem with the file")
//    })
})
