import { Partitions } from "./partitions";
import { Submission, getStudentByEmail } from "classroom-api";
import { getArgs } from './cli'
const {hw} = getArgs()

type S = Submission
const urls = {
	homework: 'https://freeuni-digital-technologies.github.io/homework/'
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
        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},

        დავალება დაგვიანებით ატვირთე და ქულა არ ჩაგეთვლება, მაგრამ უკუკავშირის მიზნით გიგზავნი შედეგს:

        ${s.results}
        
        ია
        
        ${fileInfo(s)}
    `,
    invalid: (s: S) => `
        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},

        დავალების ფაილს არასწორი სახელი აქვს. 
        ფაილის სახელში ვერ მოიძებნა '${s.emailId}.k' და/ან არის არანებადართული სიმბოლოები (ყველაზე ხშირად სფეისი ეპარებათ ხოლმე). 
        
        გადახედე დავალების ატვირთვის წესებს აქ: ${urls.homework}    

        ${s.results}

        ${blocked}

        ია
        
        ${fileInfo(s)}
    `,

    // error/invalid მესიჯები უნდა იყოს ერთგან გაწერილი და ყველას თავისი მესიჯი/გამოსწორება ეწეროს
    error: (s: S) => `
        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},

        
        ფაილის წესებიც სრულყოფილად გაქვს დაცული, მაგრამ 
        სინტაქსური ან სხვა პრობლემის გამო პროგრამა კოდს ვერ უშვებს.

        მეილს თან ვურთავ ტესტერის მესიჯს. თუ მესიჯი გაუგებარია, მაშინ გადახედე ზოგად წესებს ამ ბმულზე: 
        
        ${urls.homework}

		შეცდომის მიზეზი ასევე შეიძლება იყოს ის რომ პროგრამა function start() {....} -ში არ გიწერია. სემინარის და დავალების გვერდზე არის ახსნილი როგორ
        ჩასვა კოდი ფუნქციაში, ახლა დეტალურად გაგება არ გჭირდება უბრალოდ თითო ხაზი უნდა დაუმატო კოდის დასაწყისში და ბოლოს.

        ${s.results}

        ${blocked}

        ია
        
        ${fileInfo(s)}
    `,
    // TODO პირველი/მეორე და ა.შ ქონდეს დავალებასაც კონფიგურაციაში,
    // ასევე ლინკი საიტის.
    failed: (s: S) => `
        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},
        
        ფაილის წესები სრულყოფილად გაქვს დაცული და კოდშიც
        სინტაქსური შეცდომები არაა, მაგრამ კარელი დავალების ყველა კრიტერიუმს თავს ვერ ართმევს. 

        აი რა ტესტები გაიარა და/ან ვერ გაიარა შენმა კოდმა:

        ${s.results}

        დავალების წარმატებით ჩაბარებასთან ახლოს ხარ, თუ დედლაინამდე დრო დარჩა, შეგიძლია თავიდან ატვირთო. წარმატებები!

        ია
        
        ${fileInfo(s)}
    `,
    passed: (s: S) => `
        გამარჯობა ${getStudentByEmail(s.emailId)?.georgianName},

	დავალება ჩაბარებულია. ყველაფერი სწორად გააკეთე :) 

        ია
    `

}
