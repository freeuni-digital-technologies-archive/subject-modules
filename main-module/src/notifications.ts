import { getArgs } from './cli'
import { Partitions } from './partitions'
import { Submission } from 'dt-types'
import { sendEmails } from 'classroom-api'
import { Run, RunOpts } from './runs'
import { templates, S } from './templates'
import { HwConfig } from './homework'
import { moduleKarel } from './modules/karel'
import { moduleWeb } from './modules/web'
import { SubjectModule } from './types/module'


function notifyLastRun() {
    const { hw, runOpts } = getArgs()
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
    const subjectFunction = (hwName: string)  => {
        return `ციფრული ტექნოლოგიები: დავალების შედეგი - ${hwName}`
    }
    const module: SubjectModule = hw.module == 'karel' ? moduleKarel : moduleWeb
    notify(results, categoriesToNotify, subjectFunction, hw, runOpts, module.emailTemplates)
}

// TODO refactor this
export function notify(
        results: Partitions<Submission[]>,
        categoriesToNotify: Partitions<boolean> | any,
        subjectFunction: (hwName: string) => string,
        hw: HwConfig,
        runOpts: RunOpts,
        emailTemplates: Partitions<(s: S) => string> | any
    ) {
    const subject = subjectFunction(hw.name)
    const emails = Object.entries(results)
        .map(([type, submissions]: [string, Submission[]]) => {
            const submissionsWithValidEmail = submissions.filter(validEmail)
            // @ts-ignore
            const template = hw.emailTemplates[type] || emailTemplates[type] || templates[type]
            if (runOpts.omit && runOpts.omit.includes(type)) {
                return submissionsWithValidEmail.filter(s => hw.force?.includes(s.emailId))
                    .map(addToString)
                    .map(s => getEmail(s, template(s), subject))
            } else if (categoriesToNotify[type]) {
                return submissionsWithValidEmail
                    .map(addToString)
                    .map(s => getEmail(s, template(s), subject))
            } else {
                return []
            }
        })
        .flat()
    const failedEmail = runOpts.continue + '@freeuni.edu.ge'
    const continuefrom = runOpts.continue ? emails.map(e => e.to).indexOf(failedEmail) : 0
    const emailsToSend = emails.slice(continuefrom, emails.length)
    if (runOpts.trial) {
        console.log(emailsToSend)
    } else  {
        sendEmails(emailsToSend, 2000)
    }
    return emailsToSend
}


const badEmailAddressMessage =  `
გამარჯობა!
ციფრული ტექნოლოგიების Google Classroom-ზე აუცილებელია რომ დარეგისტრირდე @freeuni.edu.ge მეილით. 
ეს მეილი მოგდის რადგან დავალება არასწორი მეილით ატვირთე და აუცილებელია რომ კლასრუმზე თავისუფალი უნივერსიტეტის მეილით დარეგისტრირდე და იქიდან ატვირთო დავალება. 

პატივისცემით, ია
`

function validEmail(s: Submission) {
    return s.emailAddress == s.emailId + '@freeuni.edu.ge'
}

function getEmail(s: Submission, 
    body: string, 
    subject: string ) {
     if(validEmail(s)){
         return {
              to: s.emailAddress,
              subject: subject,
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


