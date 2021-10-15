import { mergeResults } from './partitions'
import { setEnv } from './config'
const { hw, runOpts } = setEnv()
import fs from 'fs'
import { getStudents, UserProfile } from 'classroom-api'

function main() {
	const students = getStudents()
	const results = mergeResults(hw, runOpts)
	const unsubmitted = students.filter(s => 
            !results.find(r => 
                r.emailId === s.emailId))
    console.log(students.length, results.length, unsubmitted.length);
}


main()