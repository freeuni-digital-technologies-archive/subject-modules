import { Partitions } from "./partitions";
import { StudentList } from "classroom-api";
import { Submission } from 'dt-types';
import { config } from './config'

export type S = Submission
const urls = {
	homework: 'https://freeuni-digital-technologies.github.io/homework/',
    web_homework: 'https://freeuni-digital-technologies.github.io/homework/web_hws.html'
}
// TODO ეს სჯობს რომ სხვაგან იყოს. უბრალოდ submission-ს მოყვეს
const students = new StudentList(config.STUDENTS_DATA_PATH)

function fileInfo(s: S) {
    return `
    ---

    ქვემოთ ბმულები სტუდენტისთვის არ არის. 
    დავალების ნახვა კლასრუმზე: ${s.alternateLink.replace(/\.com\/c\//, '.com/u/2/c/')} 
    გადმოწერა: ${s.attachment!.downloadUrl.replace(/authuser=0/, 'authuser=2')}
    `
}


// TODO აქ თავისით უნდა გადაწყვიტოს დედლაინამდე დრო არის თუ არა, კონფიგში წერია
const blocked = 'ამ პრობლემის გამო დავალება ტესტირების შემდეგ ნაბიჯზე ვერ გადადის და სხვა შეცდომების არსებობა ცნობილი არ არის. თუ დედლაინამდე დრო დარჩა, შეგიძლია თავიდან ატვირთო. \
            \
            წარმატებები!'

export type EmailTemplate = (s: S) => string

export const templates: Partitions<EmailTemplate> = {
    late: (s: S) => `
        ${summaries.greeting(s)},

        დავალება დაგვიანებით ატვირთე და ქულა არ ჩაგეთვლება, მაგრამ უკუკავშირის მიზნით გიგზავნი შედეგს:

        ${s.results}
        
        ია
        
        ${fileInfo(s)}
    `,
    invalid: (s: S) => `
        ${summaries.greeting(s)},

        ${summaries.invalid(s)}

        ია
        
        ${fileInfo(s)}
    `,

    // error/invalid მესიჯები უნდა იყოს ერთგან გაწერილი და ყველას თავისი მესიჯი/გამოსწორება ეწეროს
    error: (s: S) => `
        ${summaries.greeting(s)},

        ${summaries.error(s)}
        
        ია
        
        ${fileInfo(s)}
    `,
    // TODO პირველი/მეორე და ა.შ ქონდეს დავალებასაც კონფიგურაციაში,
    // ასევე ლინკი საიტის.
    failed: (s: S) => {
        const failed = s.results.filter(r => !r.passed)
        const passed = s.results.filter(r => r.passed)
        const testCount = s.results.length
        const grade = passed.length/testCount*4
        return `
        ${summaries.greeting(s)},
        
        შენი დავალება მიღებულია და გადის ${passed.length} ტესტს ${testCount}-დან. 
        ქულა იქნება ${grade} 4-დან. 

        ქვემოთ დავურთავ, რომელი ტესტები ვერ გაიარა შენმა კოდმა. დედლაინამდე თუ დრო გექნება, შეგიძლია ეს ნაწილებიც გამოასწორო. 
თუ თვლი რომ რამე არასწორია, უპასუხე ამ მეილს, ოღონდ cc-ში დაამატე გიგი. 

        ${failed.map(t => t.message).join('\n***\n')}

        
        ია
        
        ${fileInfo(s)}
    `},
    passed: (s: S) => `
        ${summaries.greeting(s)},

	   დავალება ჩაბარებულია. ყველაფერი სწორად გააკეთე :) 

        ია
    `

}


export const summaries = {
    greeting: (s: S) => {
    return `გამარჯობა ${students.getStudentByEmail(s.emailId)?.georgianName}`
    },

    error: (s: S) => {
        return `
            ფაილის წესებიც სრულყოფილად გაქვს დაცული, მაგრამ 
            სინტაქსური ან სხვა პრობლემის გამო პროგრამა კოდს ვერ უშვებს. რადგანაც
            პროგრამის დიდი ნაწილი ახალი შეცვლილია, დიდი შანსია ჩვენი შეცდომაც იყოს.
            მიწერე გიგის და გაარკვევთ ერთად <3

            მეილს თან ვურთავ ტესტერის მესიჯს.
            
            ${urls.homework}

            ${s.results}

            ${blocked}
        `
    },

    invalid: (s: S) => {
        return `
            როგორც ჩანს, დავალება ადრე დაიწყე და ჩემს მიერ არასწორად გამოგზავნილ წესს მიყევი ატვირთვისას.
            პროგრამამ რომ შენი დავალების გასწორება შეძლოს, საჭიროა განახლებული წესებით ატვირთო. 
             ფაილები დაზიპე და ასევე
            html ფაილს აუცილებლად index.html უნდა ერქვას. ბოდიშს გიხდი ამ შეცდომის გამო.

            დაზიპვა თუ არ იცი, ინსტრუქცია ამ გვერდზეა: ${urls.web_homework}. თუ თავიდან ატვირთვის
            შემდეგ პრობლემა ისევ განმეორდა, დაუკავშირდი გიგის რომ დაგეხმაროს <3 

            
            დიდი მადლობა!

            ${s.results}
    `

    }

}

