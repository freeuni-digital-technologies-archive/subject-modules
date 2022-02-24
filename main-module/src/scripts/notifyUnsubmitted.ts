import { mergeResults, Partitions } from '../partitions'

import { getArgs } from '../cli'
import { notify } from '../notifications'
import { S } from '../templates'

function main() {
	const { hw, runOpts } = getArgs()
	const results: S[] = mergeResults(hw, runOpts)
	const partitioned:any = {}
    // 😢😢😢😢 ეს მთლიანი პროცესი
    // რამ მომაფიქრებინა partitions, ყოფილიყო submission-ის 
    // ველი თავიდანვე
    results.forEach(r => {
    	if (r.status) {
    		if (partitioned[r.status]) {
    			partitioned[r.status].push(r)
    		} else {
    			partitioned[r.status] = [r]
    		}
    	}
    })

    notify(
    	partitioned,
    	categoriesToNotify,
    	subject,
    	hw,
    	runOpts,
    	{}
    	)
}

function subject(hwName: string) {
	return `მნიშვნელოვანი! ${hwName} არ არის ჩაბარებული`
}

const categoriesToNotify: Partitions<boolean> | any = {
        crashed: false,
        notSubmitted: true,
        late: false,
        invalid: true,
        error: false,
        failed: false,
        passed: false,
        none: false
}



const templates = {
	invalid: (s: S) => `		
		<p>ეს არის ავტომატურად გამოგზავნილი შეტყობინება იმის შესახსენებლად, რომ პროექტისთვის
		 ბოლოს ატვირთული ფაილები არასწორ ფორმატშია, რის გამოც არ შემოწმებულა და 
		 არ ითვლება ჩაბარებულად. თუ დედლაინამდე სწორ ფორმატში არ ატვირთავ, 
		 შენი შეფასება იქნება 0 ქულა.</p>

		<p>ყოველი შემთხვევისთვის ქვემოთ ჩავსვამ ბოლო შედეგს</p>
		
		${s.results.map(r => `
                    <p><strong>${r.details}</strong></p>
                `).join('\n')}
	`,
	notSubmitted: (s: S) => `
		<p>დედლაინამდე მხოლოდ ერთი დღეა დარჩენილი და პროექტი ჯერ კიდევ არ გაქვს გამოგზავნილი. დღეიდან ფაილების 
		ვალიდურობას ისევ სერვერი შეამოწმებს. მე სამშაბათამდე ხაზზე არ ვარ და ვეღარ შევძლებ დახმარებას.</p>

		<p>შეგახსენებ, რომ ნებისმიერი შეცდომის გამოსწორების შესაძლებლობა გექნება,
		მაგრამ მხოლოდ იმ შემთხვევაში, თუ ამას დედლაინამდე მოასწრებ. წინა დღეების გამოცდილებით, 
		უმეტესობა ინსტრუქციებში ფორმატის მოთხოვნას არ კითხულობთ რის გამოც საჭირო ხდება
		ხოლმე ორჯერ თავიდან ატვირთვა. <strong>ამას ვერ შეძლებთ თუ ბოლო წუთებში 
		დაიწყებთ ფაილების ატვირთვას.</strong> ერთადერთი, რითიც შემიძლია დაგეხმაროთ, არის რომ
		პროგრამა უფრო მეტი სიხშირით შეასწორებს ხოლმე ატვირთულ ფაილებს (10-15წთ)</p> 
		
		<p>პროექტის ფაილები უნდა ატვირთოს გუნდის <strong>ყველა</strong> წევრმა</p>

		<p>კლასრუმზე მითითებული თარიღის შემდეგ პროექტის ფაილები/შესწორებები არ მიიღება/მოწმდება.</p>
	`
}

main()