import { Attachment, StudentSubmission } from "./types";
import { getStudentById } from "./students";
import { sortByDate } from "./utils";

export class Submission {
	static turnedIn(s: any): boolean {
		return s.state == 'TURNED_IN'
	}
	static fromResponse(
		response: StudentSubmission
	) {
		let profile = getStudentById(response.userId!)! // fetched from students.json
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
	static getTimeStamp(response: StudentSubmission): Date {
		const timeStamp = response.submissionHistory!
			.filter(e => e.stateHistory)
			.map(e => e.stateHistory!)
			.filter(Submission.turnedIn)
			.map(e => e.stateTimestamp!)
			.map(t => new Date(t))
			.sort(sortByDate)[0]
		return new Date(timeStamp)
	}
	public attachment?: Attachment
	public timeStamp?: Date
	// TODO create types package
	public results: any[]
	public incorrectFormat?: boolean
	public crashed?: boolean
	// which partition it belongs to
	// used only during mergeResults 
	public status?: string
	public check?: boolean
	public score?: number
	constructor(
		public id: string,
		public emailId: string,
		public emailAddress: string,
		private state: string,
		public alternateLink: string,
		private late?: boolean
	) {
		this.results = []
	}

	public turnedIn() {
		return Submission.turnedIn(this)
	}
	public onTime() {
		return this.turnedIn() && !this.late
	}
	public setAttachment(a: Attachment, timeStamp: Date) {
		this.attachment = a
		this.timeStamp = timeStamp
		// this.checkFormat()
	}

	public addResults(results: any[]): Submission {
		this.results = this.results.concat(results)
		return this
	}
	private correctTitle() {
		const title = this.attachment!.title
		return title.toLowerCase().includes(this.emailId + '.k')
	}

	private invalidCharacters() {
		return this.attachment!.title.match(/[^\w._\d]/g)
	}

	public submittedAfter(date: Date) {
		if (!this.timeStamp)
			return false
		return this.timeStamp!.getTime() > date.getTime()
	}

	public hasErrors(): boolean {
		return this.results.find(e => e.error)
	}

	public passed(): boolean {
		return this.results.length > 0 && this.results.filter(e => e.passed).length == this.results.length
	}

	public qualifies(): boolean {
		return !this.crashed && this.onTime() && !this.incorrectFormat
	}

	public checkFormat(): Submission {
		if (!this.correctTitle()) {
			this.incorrectFormat = true
			this.results.push({
				error: true,
				message: "submission title is incorrect",
				details: `title needs to contain ${this.emailId + '.k'}`
			})
		}
		const invalidChars = this.invalidCharacters()
		if (invalidChars) {
			this.incorrectFormat = true
			const chars = Array.from(new Set(invalidChars.map(e => e.replace(' ', ' (space)'))))
			this.results.push({
				error: true,
				message: "submission title is incorrect",
				details: `title contains invalid characters. Only digits, numbers, underscore and '.' are allowed. Your submission contained: ${chars}`
			})
		}
		return this
	}
}
