import { Submission, Result } from 'dt-types';
import { Run, log } from "../runs";

import path from 'path'
import { HwConfig } from '../types/homework'
import { Drive } from "classroom-api"

import { SubjectModule, defaultPrepareSubmission } from '../types/module'
import { testSubmission } from "codehskarel-tester";

function downloadAtInterval(submission: Submission, drive: Drive,  index: number, run: Run, saveFile: any): Promise<string> {
    const attachment = submission.attachment!
    const fileName = attachment.title
    const id = attachment.id
    const path = `${run.moveDir}/${fileName}`
    return new Promise((resolve) => {
        setTimeout(() => {
            if (run.opts.download) {
                if (process.env.NODE_ENV === 'production')
                    console.log(`${submission.emailId}: downloading`)
                saveFile(drive, id, path)
                    .then(() => resolve(path))
            } else {
                resolve(path)
            }
        }, (index) * 200)

    })
}

export const moduleKarel: SubjectModule = {
	downloadAtInterval: downloadAtInterval,
	testSubmission: testSubmission,
	prepareSubmission: defaultPrepareSubmission,
	asynchronousTest: true,
    emailTemplates: {}
}
