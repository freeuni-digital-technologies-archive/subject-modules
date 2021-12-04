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