import { getCurrentHWs } from './config'
import shell from 'shelljs'
import {CronJob} from 'cron'

async function go(){
	var homework = getCurrentHWs()
	homework.forEach(async v => {
		console.log('yarn start --hw ' + v.id)
		var res = shell.exec('yarn start --hw ' + v.id).stdout
		// console.log(res)
		// console.log()
		if(res.search('no new submissions')!=-1)
			return
		await new Promise(resolve => setTimeout(resolve, 5000)); //sleep 5s
		// console.log('yarn notify --hw ' + v.id + ' --trial true')
		// shell.exec('yarn notify --hw ' + v.id + ' --trial true')
		console.log('yarn notify --hw ' + v.id)
		shell.exec('yarn notify --hw ' + v.id)
		
	})
}

async function main() {
	console.log()
	go()
	var job = new CronJob('0 28 * * * *', go, null, true, 'Asia/Tbilisi')
	job.start()
}

main()
