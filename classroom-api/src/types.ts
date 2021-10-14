import {classroom_v1, drive_v3} from 'googleapis'

export interface UserProfile extends classroom_v1.Schema$UserProfile {
    georgianName?: string
    emailId?: string
}

export interface StudentSubmission extends classroom_v1.Schema$StudentSubmission {

}

export interface StateHistory extends classroom_v1.Schema$StateHistory {

}
export type Drive = drive_v3.Drive

export interface HomeWork {
    name: string,
    id: string
}
export class Attachment  {
    static getDownloadUrl(id: string, authUser = 0) {
        return `https://drive.google.com/a/freeuni.edu.ge/uc?authuser=${authUser}&id=${id}&export=download`
    }
    id: string
    downloadUrl: string
    title: string
    constructor(driveFile: classroom_v1.Schema$DriveFile) {
        this.id = driveFile.id!
        this.downloadUrl = Attachment.getDownloadUrl(this.id)
        this.title = driveFile.title!
    }
}