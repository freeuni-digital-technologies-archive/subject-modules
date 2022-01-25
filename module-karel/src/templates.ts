import { Partitions } from "./partitions";
import { Submission } from 'dt-types';

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
        
        <div>
        ${summaries.error(s)}
        </div>
        <p>ია</p>
        
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
        
        <p>
        შენი დავალება მიღებულია და გადის ${passed.length} ტესტს ${testCount}-დან. 
        ქულა იქნება ${grade} 4-დან. 
        </p>
        <p>
        ქვემოთ დავურთავ, რომელი ტესტები ვერ გაიარა შენმა კოდმა. დედლაინამდე თუ დრო გექნება, შეგიძლია ეს ნაწილებიც გამოასწორო. 
თუ თვლი რომ რამე არასწორია, უპასუხე ამ მეილს, ოღონდ cc-ში დაამატე გიგი. 
        </p>
        <p>
        ${failed.map(t => t.message).join('</p><p>')}
        </p>
        
        <p>ია</p>
        
        ${fileInfo(s)}
    `},
    passed: (s: S) => `
        ${summaries.greeting(s)},

	   <p>დავალება ჩაბარებულია 🥳 </p>

        <p>ია</p>
    `

}


export const summaries = {
    greeting: (s: S) => {
    return `<p>გამარჯობა ${s.georgianName}</p>`
    },

    error: (s: S) => {
        return `
            ფაილის წესებიც სრულყოფილად გაქვს დაცული, მაგრამ 
            სინტაქსური ან სხვა პრობლემის გამო პროგრამა კოდს ვერ უშვებს. 

            მეილს თან ვურთავ ტესტერის მესიჯს.
            
            ${urls.homework}

            ${s.results}

            ${blocked}
        `
    },

    // LATER move to web
    invalid: (s: S) => {
        return `
            დავალება არასწორ ფორმატშია და გამსწორებელი პროგრამა ვერ ხსნის.
            <p>- არცერთ ფაილს არ უნდა ქონდეს სახელი შეცვლილი</p>
            <p>- ფაილები უნდა იყოს დაზიპული. ზიპი შენს email id-ის უნდა შეიცავდეს</p>
            დაზიპვა თუ არ იცი, ინსტრუქცია ამ გვერდზეა: ${urls.web_homework}.

            ${s.results.map(r => `<p>${r.details}</p>`)}
    `

    }

}

