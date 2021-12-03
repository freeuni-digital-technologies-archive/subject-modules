import { ClassroomApi } from './classroom-api'
import { UserProfile } from './types'
import { Authenticator } from './authenticate'
const translit = require('translitit-latin-to-mkhedruli-georgian')

function prepareProfile(p: UserProfile) {
	delete p.permissions
	delete p.photoUrl
	p.emailId = p.emailAddress?.match(/(.*)@/)![1]
	p = translitName(p)
	return p
}

export async function getSingleStudent(classroom: ClassroomApi, id: string): Promise<UserProfile> {
	let p: UserProfile = await classroom.getStudentProfile(id) 
	return prepareProfile(p)
}

export async function getStudentList(className: string, auth: Authenticator): Promise<UserProfile[]> {
	return ClassroomApi
		.findClass(className, auth)
		.then(classroom => classroom.getUserProfiles())
		.then(profiles => profiles
			.map(prepareProfile)
		)
}

function translitName(p: UserProfile): UserProfile {
	const transed = translit(p.name?.givenName)
	const matches = replace.find(e => transed.includes(e[0]))
	const res = (matches) ?
		transed.replace(matches[0], matches[1])
		: transed
	p.georgianName = res
	return p
}
const replace = [
	['ტამარ', 'თამარ'],
	['ტაკ', 'თაკ'],
	['დატო', 'დათო'],
	['დავიტ', 'დავით'],
	['ტეიმურაზ', 'თეიმურაზ'],
	['გვანწა', 'გვანცა'],
	['ოტარ', 'ოთარ'],
	['ლეკს', 'ლექს'],
	['ტორნიკე', 'თორნიკე'],
	['კეტ', 'ქეთ'],
	['ტეკლ', 'თეკლ'],
	['სოპ', 'სოფ'],
	['ტატია', 'თათია'],
	['ნუწ', 'ნუც'],
	['წოტნ', 'ცოტნ'],
	['ტინატინ', 'თინათინ'],
	['ტინა', 'თინა'],
	['ნინწა', 'ნინცა'],
	['ტეო', 'თეო'],
	['ტეა', 'თეა'],
	['ავტ', 'ავთ'],
	['ტამაზ', 'თამაზ'],
	['ნატია', 'ნათია'],
	['დაჭი', 'დაჩი'],
	['არჭილ', 'არჩილ'],
	['ტენგიზი', 'თენგიზ'],
	['ბეკა', 'ბექა'],
	['ტაზო', 'თაზო'],
	['მატე', 'მათე'],
	['ელიზაბეთ, 'ელისაბედ']
]

export async function downloadStudentList(className: string, auth: Authenticator): Promise<UserProfile[]> {
	return getStudentList(className, auth)
}
