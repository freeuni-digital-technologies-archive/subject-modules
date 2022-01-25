import { Attachment, Submission } from "dt-types";
import { StudentSubmission } from "./types"
import { StudentList } from "./students";
import { sortByDate } from "dt-utils";


function getTimeStamp(response: StudentSubmission): Date {
	const timeStamp = response.submissionHistory!
		.filter(e => e.stateHistory)
		.map(e => e.stateHistory!)
		.filter(Submission.turnedIn)
		.map(e => e.stateTimestamp!)
		.map(t => new Date(t))
		.sort(sortByDate)[0]
	return new Date(timeStamp)
}

export function fromResponse(
	response: StudentSubmission,
	studentList: StudentList
) {
	let profile = studentList.getStudentById(response.userId!)! // fetched from students.json
	const submission = new Submission(
		response.id!,
		profile.emailId!,
		profile.emailAddress!, 
		response.state!,
		response.alternateLink!,
		response.late!
	)
	if (submission.turnedIn() && response.assignmentSubmission?.attachments && response.assignmentSubmission?.attachments[0].driveFile) {
		const attachments = response.assignmentSubmission?.attachments
		const attachment = new Attachment(attachments![0].driveFile!)
		const timeStamp = getTimeStamp(response)
		submission.setAttachment(attachment, timeStamp)
	}
	return submission

}