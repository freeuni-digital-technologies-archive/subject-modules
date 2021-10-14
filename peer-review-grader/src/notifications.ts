import { setEnv } from './config'
const { hw, runOpts } = setEnv()

import { Partitions } from './partitions'
import { Submission, sendEmails } from 'classroom-api'
import { Run } from './runs'
import { templates } from './templates'
// const email = require('../../../results-manager/backend/services/email')

const run = new Run(hw, runOpts)
const results = run.previousRunInfo
function main() {
    const emails = Object.entries(results)
        .map(([type, submissions]: [string, Submission[]]) => {
            const template = templates[type]
            // const template = tempTemplate
            if (runOpts.omit.includes(type)) {
                return submissions.filter(s => hw.force?.includes(s.emailId))
                    .map(addToString)
                    .map(s => getEmail(s, template(s)))
            } else if (notify[type]) {
                return submissions
                    .map(addToString)
                    .map(s => getEmail(s, template(s)))
            } else {
                return []
            }
        })
        .flat()
    const failedEmail = runOpts.continue + '@freeuni.edu.ge'
    const continuefrom = runOpts.continue ? emails.map(e => e.to).indexOf(failedEmail) : 0
    if (runOpts.trial) {
        console.log(emails.slice(continuefrom, emails.length))
    } else {
        sendEmails(emails.slice(continuefrom, emails.length), 2000)
    }

}

function getEmail(s: Submission, body: string) {
    return {
        to: s.emailId + '@freeuni.edu.ge',
        subject: subject(hw.name),
        text: body
    }
}
function addToString(submission: Submission) {
    submission.results.toString = () => JSON.stringify(
        submission.results)
        .replace(/},/g, '\n\n')
        .replace(/[{}"\[\]]/g, '')
    return submission
}

const notify: Partitions<boolean> | any = {
    crashed: false,
    notSubmitted: false,
    late: true,
    invalid: true,
    error: true,
    failed: true,
    passed: true,
    none: false
}

function subject(hwName: string) {
    return `ციფრული ტექნოლოგიები: დავალების შედეგი - ${hwName}`
}

main()