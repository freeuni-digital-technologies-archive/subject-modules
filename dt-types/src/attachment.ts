import {classroom_v1} from 'googleapis'

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