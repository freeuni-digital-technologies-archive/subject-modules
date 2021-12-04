import { Partitions } from "./partitions";
import { Submission } from "dt-types";
import { getStudentByEmail } from "classroom-api";
import { getArgs } from './config'
const {hw} = getArgs()

type S = Submission
const urls = {
    homework:'https://classroom.google.com/c/NTM3MTA4ODI1ODJa/p/NjM0OTE0NDQyNDZa/details',
    karelFile: 'https://freeuni-digital-technologies.github.io/info/peer_review.html'
}

function fileInfo(s: S) {
    return `
    ქვემოთ ბმულები სტუდენტისთვის არ არის. 
    დავალების ნახვა კლასრუმზე: ${s.alternateLink.replace(/\.com\/c\//, '.com/u/2/c/')} 
    გადმოწერა: ${s.attachment!.downloadUrl.replace(/authuser=0/, 'authuser=2')}
    `
}
const blocked = 'ამ პრობლემის გამო დავალება ტესტირების შემდეგ ნაბიჯზე ვერ გადადის და სხვა შეცდომების არსებობა ცნობილი არ არის. თუ დედლაინამდე დრო დარჩა, შეგიძლია თავიდან ატვირთო. \
            \
            წარმატებები!'
let [earlySuccess, earlyFail, moduleEnd]= ['', '','']
// earlySuccess = `, თან დედლაინამდე ამდენი დღით ადრე. ძალიან მაგარია რომ ასეთი მონდომებით სწავლობ კოდის წერას` //
// earlyFail = `ძალიან მაგარია, რომ ასე ადრე დაიწყე დავალების გაკეთება. ამ გადაწყვეტილების წყალობით კიდევ უამრავი დრო გაქვს რამდენიმე ხარვეზის გამოსასწორებლად. `
if (hw.id.includes('bonus')) {
    moduleEnd = `გილოცავ კარელის ბოლო დავალების წარმატებით ჩაბარებას! წარმატებები საგნის დანარჩენ ნაწილებზეც :)`
} else {
    moduleEnd = `გილოცავ ამდენი ამოცანის წარმატებით ამოხსნას.`
}
export const templates: Partitions<(s: S) => string> | any = {
    late: (s: S) => `
        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},

        დავალება დაგვიანებით ატვირთე და ქულა არ ჩაგეთვლება, მაგრამ უკუკავშირის მიზნით გიგზავნი შედეგს:

        ${s.results}
        
        ალექსანდრე
        
        ${fileInfo(s)}
    `,
    invalid: (s: S) => `
        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},

        ${earlyFail}დავალების ფაილს არასწორი სახელი აქვს. ფაილის სახელში ვერ მოიძებნა '${s.emailId}.k' და/ან არის არანებადართული სიმბოლოები. დავალების სახელის დარქმევის წესი 
        ${urls.homework}    

        ${s.results}

        ${blocked}

        ალექსანდრე
        
        ${fileInfo(s)}
    `,
    error: (s: S) => `
        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},

        ${earlyFail}შენს ატრვირთულ შეფასებებში შეცდომაა. მეილს თან ვურთავ მესიჯს. თუ მესიჯი გაუგებარია, მაშინ გადახედე წესებს ამ ბმულზე: 
        ${urls.karelFile}
        გთხოვ ჩახედო ასატვირთი ფაილის მაგალითს(ერთი zip ფაილი უნდა ატვირთო რომელშიც ორივე ფაილია):
        https://drive.google.com/file/d/1nU0ztTvwIwhRtQH5Muz5xcp6LPlsnv-K/view?usp=sharing

        ${s.results}

        ${blocked}

        ალექსანდრე
        
        ${fileInfo(s)}
    `,
    failed: (s: S) => `
        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},
        
        ${earlyFail}კარელი დავალების ყველა კრიტერიუმს თავს ვერ ართმევს. აი რა ტესტები გაიარა და/ან ვერ გაიარა შენმა კოდმა:

        ${s.results}

        დავალების წარმატებით ჩაბარებასთან ახლოს, ხარ, თუ დედლაინამდე დრო დარჩა, შეგიძლია თავიდან ატვირთო. წარმატებები!

        ალექსანდრე
        
        ${fileInfo(s)}
    `,
    passed: (s: S) => `
        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},

        შენი ატვირთული შეფასებები მიღებულია და მათში შეცდომა არ არის. მადლობა

        ალექსანდრე
        ${fileInfo(s)}
    `

}

function getProjectScoreSummary(s: Submission) {
    return s.results.filter(e => e.score !== null).map(e => e.message.substr(0, 40) + '...').join('\n')
}
