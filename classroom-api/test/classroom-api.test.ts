import { expect } from 'chai'
import { ClassroomApi} from "../src";
import {createDrive, downloadFile} from "../src/classroom-api";

describe('test case', () => {
    it('',  () => {
        // ClassroomApi
        //     .findClass('შესავალი ციფრულ ტექნოლოგიებში')
        //     .then(classroom => classroom.listCourseWork())
        //     .then(courseWork => console.log(courseWork))
    })
    it('', () => {
        createDrive().then(drive =>
            downloadFile(drive, '1y4WJ_4mkH-l68zwm-xuaIAFWsNDlwdoC'))
            .then(file => console.log(file))
    })
})

