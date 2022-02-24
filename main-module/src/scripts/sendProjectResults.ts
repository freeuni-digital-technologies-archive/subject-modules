import {ArgumentParser} from "argparse";
import {sendEmails} from "classroom-api";
import fse from "fs-extra";
import { ProjectsInfo } from "../types/projectsInfo";
import {summarizeResults} from "./sumResults";
import {ProjectGroup} from "../modules/groupProject";

const projectsPath = "/Users/ia/dev/data"
const projectFilesPath = projectsPath + '/files'

function logProjectResults(results: ProjectResult[], pi: ProjectsInfo) {
    const projectScores = flattenProjectResults(results, pi)
        .map(e => {
            const { result, emailId } = e
            return `${emailId},${result.sum()}`
        }).join('\n')

    fse.writeFileSync("/Users/ia/dev/data/manualResults/project.csv", projectScores)
}


function flattenProjectResults(results: ProjectResult[], pi: ProjectsInfo) {
    return results
        .map(r => Array.from(new Set(pi.findTeamWithId(r.groupId)!.members)).map(m => {
            return {result: r, emailId: m}
        }))
        .flat()
}

function notifyResults() {
    const parser = new ArgumentParser({
        addHelp: true
    })
    parser.addArgument(['-t', '--trial'], {help: 'dont save output/print emails not send'})
    const args = parser.parseArgs()
    const results = JSON.parse(fse.readFileSync('/Users/ia/dev/data/manualResults/project_scores.json', 'utf-8'))
        .map((e: any) => new ProjectResult(e))
    const pi = new ProjectsInfo(projectsPath + '/projects.json', projectFilesPath)
    logProjectResults(results, pi)
    const summaries = summarizeResults()
    const emails = getEmails(results, pi, summaries)
    if (args.trial) {
        console.log(emails)
    } else {
        sendEmails(emails, 2000)

    }
}

function getEmails(results: ProjectResult[], pi: ProjectsInfo, summaries: any) {
    return flattenProjectResults(results, pi)
       .map(r => {
           const { result, emailId } = r
           const body = template(result, pi.findTeamWithId(result.groupId)!, summaries[emailId])
           return {
               to: emailId + '@freeuni.edu.ge',
               subject: 'პროექტის და შუალედური შეფასება - შესავალი ციფრულ ტექნოლოგიებში',
               text: body
           }
       })
}

function template(result: ProjectResult, pj: ProjectGroup, summary: any) {
    return `
    <p>გამარჯობა,</p>
    ${info}
    ${totalScore(summary)}
    ${projectScore(result)}
    ${message(result)}
`
}


function totalScore(scores: any) {
    return `
<p>შენი შუალედური შეფასება პროექტთან ერთად არის ${scores.sum}. გთხოვ კიდევ ერთხელ გადახედე და გადაამოწმე, რომ 
ყველაფერი სწორია.</p>
    <p>
    ${Object.keys(scores)
            .filter(s => s != 'sum')
            .map(s => `${scores[s]} - ${s}`)
            .join('</p><p>')}
    </p>
    <p>${getBonusMessage(scores.sum)}</p>
`
}

function getBonusMessage(sum: number) {
    const diff = sum - 70
    if (diff <= 0) {
        return ''
    }
    const disclaimer = `როგორც მანამდე უკვე ვთქვი, მაქსიმალური შუალედური შეფასება 
    70 ქულაა და 70-ს ზემოთ ბონუს ქულები ფინალურ გამოცდას არ დაემატება`
    if (diff <= 5) {
        return disclaimer + `მინდა მაინც მადლობა გადაგიხადო მონდომებისთვის, ჩემთვის
        ბევრს ნიშნავს რომ გულწრფელი ინტერესი გქონდა დამატებითი დავალების გაკეთების.`
    }
    return disclaimer + `. შენ ძალიან ბევრი ბონუსი გაქვს გაკეთებული (სულ 4ნი ხართ ასეთი სტუდენტი), მიხარია
    თუ საინტერესო იყო ეს საგანი და განსაკუთრებული მადლობა მინდა გადაგიხადო მონდომებისთვის.`

}

function projectScore(result: ProjectResult) {
    return `
        <p>იდეა: ${result.concept} ქულა ${defaultScores.concept}-დან</p> 
        <p>დიზაინი: ${result.design} ქულა ${defaultScores.design}-დან</p>
        <p>ფუნქციონალი: ${result.functionality} ქულა ${defaultScores.functionality}-დან</p>
        <p>report: ${result.report} ქულა ${defaultScores.report}-დან</p>
    `
}

const info = `
 <div>
 <p>სანამ პროექტის შეფასებას გეტყოდე, რამდენიმე მნიშვნელოვანი დეტალი:</p>
 <p>- გამოცდის შემდეგ საიტზე ავტვირთავ კითხვებს. რამე კითხვა ან კომენტარი თუ გქონდა, მეილზე არ მომწერო, 
    შეავსე <a href="https://forms.gle/kRuJB4dCJSyFSayx6">ეს ფორმა</a>. </p>
 <p> - ემისზე ქულებს (შუალედური შეფასებაც და გამოცდაც) შევიყვან 1 ან 2 კვირაში </p>
 </div>
`

function message(result: ProjectResult) {
    if (result.comment.trim().length > 0) {
        const comment = `
        <p>შენმა პროექტმა ასევე მიიღო ეს დამატებითი კომენტარი (ყველა პროექტს არ მიუღია <3):</p>
        <p><em><strong>${result.comment}</strong></em></p>
        `
        return comment + thankU
    }
   return `<p>წარმატებები</p> <p>ია</p>`
}

const thankU = `
    <p>ქვემოთ რაც წერია მნიშვნელოვანი ინფორმაცია არ არის, უბრალოდ რაღაცის
     გაზიარება მინდა იმ ჯგუფებისთვის ვისი ნაშრომებიც ძალიან მომეწონა</p>
    <p>წინა ორი სემესტრი პროექტში ასევე შედიოდა peer review-ს ნაწილი. 
    სტუდენტები ერთმანეთის პროექტებს აფასებდნენ. თავდაპირველად იმისთვის შევქმენი, 
    რომ ჩემთვის არ ყოფილიყო აუცილებელი პროექტების შემოწმება, მაგრამ მერე აღმოვაჩინე, 
    რომ პროექტების შემოწმება მოვალეობა კი არა, ამ საგნის ყველაზე საყვარელი ნაწილია.
     მომავალში peer review-ს ალბათ ისევ დავამატებ (რადგან შემსწორებლის კოდი მნიშვნელოვნად
      შეიცვალა ამ სემესტრში, ისიც გადასაწერია), მაგრამ შენი პროექტისნაირი ნაშრომების
       თვალიერებას არასდროს დავთმობ.</p>  
    <p>ჩემი თხოვნაა რომ მომავალში ამ საგნის სტუდენტებს შენი
     ნაშრომი არ ანახო/გაუზიარო (რომ ჩააბარებენ მერე შეგიძლია). ამ დავალების მთავარი 
     ნაწილი ის გზაა, რომელსაც იდეაზე ფიქრიდან რესურსების მოძიებასა
      და კოდთან ურთიერთობით გადიხარ. ყველაზე მნიშვნელოვანი უნარი, რომელიც 
      მინდა ყველამ განავითაროს არის ამ გადაწყვეტილებების დამოუკიდებლად მიღება
       და ნაკლებად განსაზღვრული შეფასების პირობებში საკუთარ თავდაჯერებულობას 
       მინდობა. ეს <strong>ყველამ</strong> შეძელით და თუ მომავალი სტუდენტები 
       დახმარებას გთხოვენ, უბრალოდ უთხარით რომ ისინიც შეძლებენ.</p>   
    <p>ეს სემესტრი კიდევ უფრო განსაკუთრებული იმით იყო, რომ პროექტზე ყველანაირი შეზღუდვა 
    მოვხსენი. ადრე მისდიოდათ სავალდებულო ტესტები სოციალური მედიის აპლიკაციის (დავალების მსგავსი),
     1-2 ფუნქცია თავისი ინიციატივით უნდა დაემატებინათ და დიზაინი შეექმნათ. დიდი ნაწილი მაგას 
     აკეთებდა, მაგრამ ბევრი წვალობდა რომ საწყისი კოდი თავისი განსხვავებული კონცეპტისთვის მოერგო, 
     ან საერთოდ მთხოვდნენ სხვა აპლიკაცია დაემატებინათ ცალკე ფოლდერში. ყველაზე მეტად კრეატიულობის
      შეზღუდვა არ მიყვარს, საგნის შექმნისას გვგქონდა იდეა რომ ნებაყოფლობით აერჩია გუნდს აპლიკაცია, 
      მაგრამ რადგან ავტომატურად მართვადი ვერ იქნებოდა, გადავიფიქრეთ. რადგან გავიგე რომ შესწორების 
      პრობლემა არ არსებობს, სატესტოდ გავაკეთე თავისუფალი თემა და აღმოჩნდა რომ ზღვა რაოდენობის 
      კრეატიულობა და მონდომება იზღუდებოდა. ყოველთვის ენდე შენს თავს და სხვებს, რომ ადამიანებს 
      წარმოსახვა, შექმნის და გაზრდის გულწრფელი სურვილი და  სწრაფვა ბუნებრივად აქვთ და ზოგჯერ 
      ხელშეწყობა კი არა, ხელის შეშლის შეწყვეტაც კი საკმარისია მისი გამოვლენისთვის.</p>
    <p>მადლობა და წარმატებები!</p>
    <p>ია <3</p>
`

class ProjectResult {
    public functionality: number;
    public groupId: string;
    public design: number;
    public concept: number;
    public report: number;
    public comment: string;
    constructor(json: any) {
        this.functionality = json.functionality
        this.groupId = json.id
        this.design = json.design
        this.concept = json.concept
        this.report = json.report
        this.comment = json.comment
    }
    sum() {
        return this.design + this.concept + this.report + this.functionality
    }

}

const defaultScores = {
    functionality: 7,
    design: 5,
    concept: 4,
    report: 4,
}

if (require.main == module) {
    notifyResults()
}