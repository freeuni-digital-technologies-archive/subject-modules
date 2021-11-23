import {google, classroom_v1, drive_v3} from 'googleapis'
import { Authenticator } from './authenticate'
import fs from "fs";

export function downloadFile(drive: drive_v3.Drive, id: string): Promise<any> {
    return new Promise((resolve, reject) => {
        drive.files.get({
            fileId: id,
            alt: 'media'
        }, {responseType: 'stream'}, (err, res) => {
            if (err) {
                console.log('Drive API returned an error :' + err)
                reject(err)
            }
            resolve(res!.data)
        })
    })
}

export function downloadZip(drive: drive_v3.Drive, id: string, path: string): Promise<string> {
    return saveFile(drive, id, path)
}

export function saveFile(drive: drive_v3.Drive, id: string, path: string): Promise<string> {
    return downloadFile(drive, id)
        .then((dataStream: any) => {
            return new Promise((resolve, reject) => {
                // console.log(`writing to ${path}`);
                const dest = fs.createWriteStream(path);
                dataStream
                  .on('end', () => {
                    console.log('Done downloading file: ' + path);
                    dest.close();
                    setTimeout(()=>resolve(path), 100) // weird erorrs occur without this timeout
                    // resolve(path);
                  })
                  .on('error', (err: any) => {
                    console.error('Error downloading file path=' + path + ' id=' + id);
                    reject(err);
                  })
                  .pipe(dest); // pipe to write stream
            });
        })
}

export function createDrive(
                            authenticator: Authenticator,
                            ): Promise<drive_v3.Drive> {
    return authenticator.authenticate()
        .then(auth => google.drive({version: 'v3', auth}))
}

function listCourses(classroom: classroom_v1.Classroom)
    : Promise<classroom_v1.Schema$Course[]> {
    return new Promise((resolve, reject) => {
        classroom.courses.list({
            pageSize: 10,
        }, (err, res) => {
		// ამ reject-ს სადღაც ვაიგნორებ (:
        if (err) {
            console.log(err)
            reject('The API returned an error: ' + err)
        }
            const courses = res!.data.courses;
            if (courses && courses.length) {
                resolve(courses)
            } else {
                reject('No courses found.');
            }
        })
    })
}

export class ClassroomApi {
    static async findClass(name: string, authenticator: Authenticator) {
        const auth = await authenticator.authenticate()
        const classroom = google.classroom({version: 'v1', auth})
        const drive = google.drive({version: 'v3', auth})
        return listCourses(classroom)
            .then(courses => {
                const filtered = courses.filter(c => c.name == name)
                if (filtered && filtered.length)
                    return filtered[0].id!
                else
                    throw "no such course found"
            })
            .then((id) => new ClassroomApi(id, classroom, drive))
    }

    constructor(
        private id: string,
        private classroom: classroom_v1.Classroom,
        private drive: drive_v3.Drive,
    ) {
    }

    download(id: string) {
        return downloadFile(this.drive, id)
    }

    async listCourseWork(): Promise<classroom_v1.Schema$CourseWork[]> {
        return new Promise((resolve, reject) => {
            this.classroom.courses.courseWork.list({
                courseId: this.id
            }, (err, res) => {
                if (err) reject('The API returned an error: ' + err);
                resolve(res!.data.courseWork!)
            })
        })
    }

    findAssignment = (name: string): Promise<string> =>
        this.listCourseWork()
            .then(courseWork => {
                const filtered = courseWork.filter(c => c.title!.includes(name))
                if (filtered && filtered.length)
                    return filtered[0].id!
                else
                    throw name + ": no such assignment found"
            })

    getSubmissions = (name: string): Promise<classroom_v1.Schema$StudentSubmission[]> =>
        this.findAssignment(name)
            .then(assignmentId =>
                new Promise((resolve, reject) => {
                    this.classroom.courses.courseWork.studentSubmissions.list({
                        courseWorkId: assignmentId,
                        courseId: this.id,
                    }, (err, res) => {
                        if (err) reject(err)
                        resolve(res!.data.studentSubmissions!)
                    })
                })
            )

    getStudentProfile(id: string): Promise<classroom_v1.Schema$UserProfile> {
        return new Promise((resolve, reject) => {
            this.classroom.userProfiles.get({userId: id}, (err, res) => {
                if (err) reject(err)
                resolve(res!.data)
            })
        })
    }

    getSubmissionStudents = (name: string): Promise<classroom_v1.Schema$UserProfile[]> =>
        this.getSubmissions(name)
            .then(submissions => submissions.map(s => s.userId!))
            .then(submissions => submissions.map(s => this.getStudentProfile(s)))
            .then(userIdPromises => Promise.all(userIdPromises))

    getUserProfiles = () =>
        this.listCourseWork()
            .then(coursework => coursework[0].title!)
            .then(this.getSubmissionStudents)
}
