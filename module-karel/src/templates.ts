import { Partitions } from "./partitions";
import { Submission, getStudentByEmail } from "classroom-api";
import { getArgs } from './cli'
const {hw} = getArgs()

export type S = Submission
const urls = {
	homework: 'https://freeuni-digital-technologies.github.io/homework/',
    web_homework: 'https://freeuni-digital-technologies.github.io/homework/web_hws.html'
}

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


export const templates: Partitions<(s: S) => string> | any = {
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
    failed: (s: S) => `
        ${summaries.greeting(s)},
        
        ფაილის წესები სრულყოფილად გაქვს დაცული და კოდშიც
        სინტაქსური შეცდომები არაა, მაგრამ შენი კოდი ზოგ ტესტს არ გადის. 
        დავალების სწორი ნაწილი ჩვეულებრივ ჩაგეთვლება, უბრალოდ ყოველი შემთხვევისთვის გიგზავნი ამ 
        ინფორმაციას. 
        აი რომელი ტესტები ვერ გაიარა შენმა კოდმა:

        ${s.results.filter(r => !r.passed)}

        დედლაინამდე თუ დრო გექნება, შეგიძლია ბოლომდე მიიყვანო. 

        ია
        
        ${fileInfo(s)}
    `,
    passed: (s: S) => `
        ${summaries.greeting(s)},

	   დავალება ჩაბარებულია. ყველაფერი სწორად გააკეთე :) 

        ია
    `

}


export const summaries = {
    greeting: (s: S) => {
    return `გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName}`
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

