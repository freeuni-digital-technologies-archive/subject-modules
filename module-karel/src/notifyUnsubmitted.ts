import { mergeResults, Partitions } from './partitions'

// ეს notifications.ts-შიც წერია
// და კარგი ამბავი ისაა რომ ორჯერ გამოძახება არაა პრობლემა...
import { getArgs } from './cli'
import fs from 'fs'
// import { getStudents, UserProfile } from 'classroom-api'
import { notify } from './notifications'
import { summaries, S } from './templates'

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
	return `მნიშვნელოვანი! დავალება ${hwName} არ არის ჩაბარებული`
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
		${summaries.greeting(s)}

		ეს არის ავტომატურად გამოგზავნილი შეტყობინება იმის შესახსენებლად, რომ ბოლოს ატვირთული
		დავალება არასწორ ფორმატშია, რის გამოც არ შემოწმებულა და არ ითვლება ჩაბარებულად. თუ დედლაინამდე
		სწორ ფორმატში არ ატვირთავ (1 წუთზე ნაკლებია საჭირო), დავალება არ ჩაითვლება.

		ყოველი შემთხვევისთვის ქვემოთ ჩავსვამ წინა მეილის ტექსტს
		ია
		
		${summaries.invalid(s)}
	`,
	notSubmitted: (s: S) => `
		${summaries.greeting(s)}

		დედლაინამდე 1 დღე რჩება და დავალება არ გაქვს გამოგზავნილი.

		შეგახსენებ, რომ ნებისმიერი შეცდომის შემთხვევაში გამოსწორების შესაძლებლობა გექნება,
		მაგრამ მხოლოდ იმ შემთხვევაში, თუ ამას დედლაინამდე მოასწრებ.

		კლასრუმზე მითითებული თარიღის შემდეგ დავალებები/შესწორებები არ მიიღება/მოწმდება

		ია
	`
}

main()