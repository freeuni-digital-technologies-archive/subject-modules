import { setEnv } from './config'
const { hw, runOpts } = setEnv()

import { Partitions } from './partitions'
import { Submission, sendEmails } from 'classroom-api'
import { Run } from './runs'
import { templates } from './templates'


function notifyLastRun() {
    const run = new Run(hw, runOpts)
    const results = run.previousRunInfo
    const categoriesToNotify: Partitions<boolean> | any = {
        crashed: false,
        notSubmitted: false,
        late: true,
        invalid: true,
        error: true,
        failed: true,
        passed: true,
        none: false
    }
    const subject = (hwName: string)  => {
    return `ციფრული ტექნოლოგიები: დავალების შედეგი - ${hwName}`
    }
    notify(results, categoriesToNotify, subject)
}


export function notify(
        results: Partitions<Submission[]>,
        categoriesToNotify: Partitions<boolean> | any,
        subject: (hwName: string) => string,
    ) {

    const emails = Object.entries(results)
        .map(([type, submissions]: [string, Submission[]]) => {
            const template = templates[type]
            // const template = tempTemplate
            if (runOpts.omit.includes(type)) {
                return submissions.filter(s => hw.force?.includes(s.emailId))
                    .map(addToString)
                    .map(s => getEmail(s, template(s), subject))
            } else if (categoriesToNotify[type]) {
                return submissions
                    .map(addToString)
                    .map(s => getEmail(s, template(s), subject))
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


const badEmailAddressMessage =  `
გამარჯობა!
ციფრული ტექნოლოგიების Google Classroom-ზე აუცილებელია რომ დარეგისტრირდე @freeuni.edu.ge მეილით. 
ეს მეილი მოგდის რადგან დავალება არასწორი მეილით ატვირთე და აუცილებელია რომ კლასრუმზე თავისუფალი უნივერსიტეტის მეილით დარეგისტრირდე და იქიდან ატვირთო დავალება. 

პატივისცემით, ია
`

function getEmail(s: Submission, 
    body: string, 
    subject:(hwName: string) => string ) {
     if(s.emailAddress == s.emailId + '@freeuni.edu.ge'){
         return {
              to: s.emailAddress,
              subject: subject(hw.name),
              text: body
         }
     } else {
         return {
              to: s.emailAddress,
              subject: 'ციფრული ტექნოლოგიები - მნიშვნელოვანი მესიჯი - არასწორი მეილი',
              text: badEmailAddressMessage
         }
     }
}
function addToString(submission: Submission) {
    submission.results.toString = () => JSON.stringify(
        submission.results)
        .replace(/},/g, '\n\n')
        .replace(/[{}"\[\]]/g, '')
    return submission
}



if (require.main == module) {
    notifyLastRun()
}


