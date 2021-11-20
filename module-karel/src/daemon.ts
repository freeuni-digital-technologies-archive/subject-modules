import { getCurrentHWs } from './homework'
import shell from 'shelljs'
import {CronJob} from 'cron'

// TODO იმის შემოწმება, ახლა გაეშვას თუ არა დავალება, აქ უნდა მოხდეს და არა yarn start-ში
async function go(){
	var homework = getCurrentHWs()
	console.log(homework)
	homework.forEach(async v => {
		console.log('yarn start --hw ' + v.id)
		var res = shell.exec('yarn start --hw ' + v.id).stdout
		// console.log(res)
		// console.log()
		if(res.search('no new submissions')!=-1)
			return
		await new Promise(resolve => setTimeout(resolve, 5000)); //sleep 5s
		//console.log('yarn notify --hw ' + v.id + ' --trial true')
		//shell.exec('yarn notify --hw ' + v.id + ' --trial true')
		console.log('yarn notify --hw ' + v.id)
		shell.exec('yarn notify --hw ' + v.id)
		
	})
}

async function main() {
console.log("starting cron job")
	go()
	var job = new CronJob('0 28 * * * *', go, null, true, 'Asia/Tbilisi')
	job.start()
}

main()
