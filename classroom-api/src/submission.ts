import { Attachment, StudentSubmission, Submission } from "dt-types";
import { StudentList } from "./students";

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
		response.late
	)
	if (submission.turnedIn() && response.assignmentSubmission?.attachments && response.assignmentSubmission?.attachments[0].driveFile) {
		const attachments = response.assignmentSubmission?.attachments
		const attachment = new Attachment(attachments![0].driveFile!)
		const timeStamp = Submission.getTimeStamp(response)
		submission.setAttachment(attachment, timeStamp)
	}
	return submission

}