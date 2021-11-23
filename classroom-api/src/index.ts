import { ClassroomApi } from './classroom-api'
import { Submission } from './submission'
import { StudentList } from './students'
import { Authenticator  } from './authenticate'
export * from './types'
export { ClassroomApi, downloadFile, downloadZip, createDrive, saveFile } from './classroom-api'
export { Submission } from './submission'
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

	return submissions.filter(response => studentList.getStudentById(response.userId!)).map(s => Submission.fromResponse(s, studentList))
}
