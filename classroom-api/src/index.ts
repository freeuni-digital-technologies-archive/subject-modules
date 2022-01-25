import { ClassroomApi } from './classroom-api'
import { StudentList } from './students'
import { Authenticator  } from './authenticate'
import { Submission } from 'dt-types'
import { fromResponse } from './submission'
//export * from './types'
export { ClassroomApi, downloadFile, downloadZip, createDrive, saveFile } from './classroom-api'
import { drive_v3 } from "googleapis" ;
export type Drive = drive_v3.Drive
export * from './students'
export * from './mailer'
export { downloadAll, downloadSome, downloadAtInterval } from './downloadHW'
export { Authenticator } from './authenticate'

export async function getSubmissions(subject: string, homework: string, studentList: StudentList, auth: Authenticator): Promise<Submission[]> {
	let classroom = await ClassroomApi.findClass(subject, auth)

	let submissions = await (classroom.getSubmissions(homework)
		.then(submissions => submissions
			.filter(response => response.id && response.userId)))

	// we need to fetch profiles if its not already in `students.json`
	// async filter does not exist btw. 
	await Promise.all(submissions.map(async response => {
		if (!studentList.getStudentById(response.userId!)) {
			await studentList.fetchStudentById(classroom, response.userId!)
		}
	}))

	return submissions.filter(response => studentList.getStudentById(response.userId!)).map(s => fromResponse(s, studentList))
}
