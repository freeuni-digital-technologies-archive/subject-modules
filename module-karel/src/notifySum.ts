import {sendEmails} from "classroom-api";
import {summarizeResults} from "./sumResults";
import {summaries} from "./templates";
import { ArgumentParser } from 'argparse'


function notifyEmails() {
    const parser = new ArgumentParser({
        addHelp: true
    })
    parser.addArgument(['-t', '--trial'], {help: 'dont save output/print emails not send'})
    const args = parser.parseArgs()
    const emails = getEmails()
    if (args.trial) {
        console.log(emails)
    } else {
        sendEmails(emails, 2000)
    }
}

function getEmails() {
    const results = summarizeResults()
    return Object.keys(results).map(emailId => {
        const scores = results[emailId]
        // @ts-ignore
        const body = `${summaries.greeting({emailId: emailId})}
         
    გიგზავნი შენს ქულას საგანში შესავალი ციფრულ ტექნოლოგიებში. სულ გაქვს ${scores.sum} ქულა. ამ ქულას დაემატება
პროექტის შეფასება, რითიც გამოითვლება შუალედური შეფასება. კიდევ ერთხელ შეგახსენებ, რომ შუალედური შეფასების 
მაქსიმუმი არის 70 ქულა, ანუ თუ ბონუსებით 70-ზე მეტს მიიღებ, ეს ქულები გამოცდის შეფასებას არ დაემატება.
         
${Object.keys(scores)
        .filter(s => s != 'sum')
        .map(s => `${scores[s]} - ${s}`)
        .join('\n')
}

    შესაძლებელია, რომ მობილობით გადმოსული რამდენიმე სტუდენტის დაგვიანებით ატვირთული დავალების შეფასება ამ ქულებში 
არ იყოს ჩათვლილი, რადგან ერთ-ერთი დოკუმენტი სადაც ჩანიშნული მქონდა წამეშალა. გთხოვ იპოვო თავდაპირველი მეილი 
სადაც დაგიდასტურე რომ დავალების გამოგზავნა შეგეძლო და იმაზე უპასუხე, ჩავასწორებ. 

    სხვა ხარვეზის შემთხვევაში უპასუხე ამ მეილს. 
    
    თუ ქულის შესწორება გახდა საჭირო, ჩასწორებულ შეფასებას მიიღებთ პროექტის ქულასთან ერთად. 
    
    წარმატებები პროექტში და გამოცდაზე.
    ია
        `

        return {
            to: emailId + '@freeuni.edu.ge',
            subject: 'დაგროვებული ქულები შესავალი ციფრულ ტექნოლოგიებში',
            text: body
        }
    })
}


if (require.main == module) {
    notifyEmails()
}


