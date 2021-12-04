import fs from 'fs'
import { ClassroomApi } from './classroom-api'
import { UserProfile } from 'dt-types'
import { getSingleStudent } from './profile'

export class StudentList {
	private students: UserProfile[]
	private path: string
	constructor(filePath?: string) {
		if (!filePath) {
			console.log('path for students, searching in existing directory')
			filePath = process.cwd() + '/students.json'
		}	
		try {
			this.students = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
			this.path = filePath
		} catch (e) {
			console.log(e)
			process.exit(1)
		}
	}

	getStudentByEmail(emailId: string) {
	    return this.students.find(e => e.emailId == emailId)
	}
	 
	getStudentById(id: string): UserProfile | undefined {
	    return this.students.find(e => e.id == id)
	}

	async fetchStudentById(classroom: ClassroomApi, id: string): Promise<UserProfile | undefined> {
		let student = await getSingleStudent(classroom, id)
		this.students.push(student)
		fs.writeFileSync(this.path, JSON.stringify(this.students, null, '\t'))
		return student 
	}

}
