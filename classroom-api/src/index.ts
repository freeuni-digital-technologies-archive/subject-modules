import { ClassroomApi } from './classroom-api'
import { Submission } from './submission'
import { getStudentById, fetchStudentById } from './students'

export * from './types'
export { ClassroomApi, downloadFile, downloadZip, createDrive, saveFile } from './classroom-api'
export { Submission } from './submission'
export * from './students'
export * from './mailer'
export { downloadAll, downloadSome, downloadAtInterval } from './downloadHW'
export { default as authenticate } from './authenticate'

export async function getSubmissions(subject: string, homework: string): Promise<Submission[]> {
	let classroom = await ClassroomApi.findClass(subject)

	let submissions = await (classroom.getSubmissions(homework)
		.then(submissions => submissions
			.filter(response => response.id && response.userId)))

	// we need to fetch profiles if its not already in `students.json`
	// async filter does not exist btw. 
	await Promise.all(submissions.map(async response => {
		if (!getStudentById(response.userId!)) {
			await fetchStudentById(classroom, response.userId!)
		}
	}))

	return submissions.filter(response => getStudentById(response.userId!)).map(s => Submission.fromResponse(s))
}
