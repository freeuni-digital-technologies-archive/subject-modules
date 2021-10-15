import fs from 'fs'
import { ClassroomApi } from './classroom-api'
import { UserProfile } from './types'
import { getSingleStudent } from './profile'
const path = process.env.STUDENTS_DATA_PATH || 'students.json'
// TODO: create file if doesn't exist
let students: UserProfile[] = [];
try {
	// TODO აქ კონფიგ ფაილიდან წაკითხვაც უნდა დაემატოს
	students = JSON.parse(fs.readFileSync(path, 'utf-8'));
} catch (e) {
	console.log(e)
}

export function getStudentByEmail(emailId: string) {
    return students.find(e => e.emailId == emailId)
}
 
export function getStudentById(id: string): UserProfile | undefined {
    return students.find(e => e.id == id)
}

export async function fetchStudentById(classroom: ClassroomApi, id: string): Promise<UserProfile | undefined> {
	let student = await getSingleStudent(classroom, id)
	students.push(student)
	// save new profile
	fs.writeFileSync(path, JSON.stringify(students, null, '\t'))
	return student 
}

export function getStudents() {
    return students
}
