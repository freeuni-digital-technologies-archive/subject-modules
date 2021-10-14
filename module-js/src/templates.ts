import { Partitions } from "./partitions";
import { Submission, getStudentByEmail } from "classroom-api";
import { getArgs } from './config'
const {hw} = getArgs()

type S = Submission
const urls = {
    homework:'https://freeuni-digital-technologies.github.io/homework/',
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
moduleEnd = `გილოცავ ამდენი ამოცანის წარმატებით ამოხსნას.`
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

        ${earlyFail}დავალების ფაილს არასწორი სახელი აქვს. დავალების სახელის დარქმევის წესი 
        ${urls.homework}    

        ${s.results}

        ${blocked}

        ალექსანდრე
        
        ${fileInfo(s)}
    `,
    error: (s: S) => `
        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},

        ${earlyFail}პროგრამის გაშვებაში პრობლემაა. მეილს თან ვურთავ ტესტერის მესიჯს. თუ მესიჯი გაუგებარია, მაშინ გადახედე წესებს ამ ბმულზე: 
        ${urls.homework}

        ${s.results}

        ${blocked}

        ალექსანდრე
        
        ${fileInfo(s)}
    `,

    failed: failTemplate,
    passed: failTemplate,

//    failed: (s: S) => `
//        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},
//     
//        ${earlyFail}კარელი დავალების ყველა კრიტერიუმს თავს ვერ ართმევს. აი რა ტესტები გაიარა და/ან ვერ გაიარა შენმა კოდმა:
//
//        ${s.results}
//
//        დავალების წარმატებით ჩაბარებასთან ახლოს, ხარ, თუ დედლაინამდე დრო დარჩა, შეგიძლია თავიდან ატვირთო. წარმატებები!
//
//        ალექსანდრე
//     
//        ${fileInfo(s)}
//    `,
//    passed: (s: S) => `
//        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},
//
//        შენმა კოდმა სრულყოფილად გაართვა დავალებას თავი${earlySuccess}.  ${moduleEnd}
//
//        ალექსანდრე
//        ${fileInfo(s)}
//    `

}


function failTemplate(s: Submission) {
    return `
გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName}, 

ფინალური პროექტის ტესტებში შენ აიღე ${s.score} ქულა 9-დან. გაითვალისწინე, რომ ეს არის მხოლოდ ტესტების კომპონენტი(9/24) სხვა კომპონენტების ქულების საგნის საბოლოო ქულებთან ერთად გაიგებთ. peer review-ს შედეგად მიღებული ქულა მოგივა დავალებების საბოლოო ქულასთან ერთად. 
გაითვალისწინე, რომ გამოგზავნილი კოდი ჯერ არ შემომწებულა პლაგიატსა და ტესტების შეცვლის მცდელობაზე. 
- დავალება არ ჩაითვლება, თუ კოდის ცვილელებების მნიშვნელოვანი ნაწილი ემთხვევა სხვა გუნდის კოდს
- თუ html ფაილში შეცვილი იყო ტესტების კოდის ნაწილი (რომელიც შესაბამისად იყო მონიშნული), ის ფაილი საერთოდ არ ჩაითვლება.
- დავალება არ ჩაითვლება ან ქულა დააკლდება ტესტის არასამართლიანად ჩათვლის სხვა ნებისმიერ მცდელობებზეც. წინა ორი უბრალოდ მაგალითია.

peer review-ს რაც შეეხება დედლაინის შემდეგ მეორე დღესვე დავიწყებთ. დანარჩენ დეტალებსაც მაშინ დაგიზუსტებთ.
ატვირთვასთან ან ტესტერთან დაკავშირებულ პრობლემებზე მომწერეთ მე და ვეცდები დროულად გიპასუხოთ. 

ალექსანდრე

დავალების ქულები დეტალურად:
${getProjectScoreSummary(s)}

-----

${fileInfo(s)}
`
}

function getProjectScoreSummary(s: Submission) {
    return s.results.map(r => ({...r, score: (r.passed ? (r.score ? r.score : 0) : 0 )})).map(r => `შენ მიიღე ${r.score} ქულა ტესტში: "${r.message.substr(0, 40)}..."`).join('\n')
}
