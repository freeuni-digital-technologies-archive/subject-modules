import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import keepTrying from 'keep-trying'

interface DownloadOptions {
    fileName: string,
    downloadUrl: string,
    downloadDir: string,
    moveDir: string,
    timeout?: number
}
const run = promisify(exec)

export function downloadAssignment(opts: DownloadOptions): Promise<string> {
    return run(`chromium '${opts.downloadUrl}'`)
        .then(output => {
            if (output.stderr)
                throw output.stderr
            return keepTrying(() => moveAssignment(opts), {
                maxAttempts: 10,
                baseTime: opts.timeout || 100
            })
        })
}

function moveAssignment(opts: DownloadOptions   ): Promise<string> {
    const location = `${opts.moveDir}/${opts.fileName}`
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                fs.renameSync(`${opts.downloadDir}/${opts.fileName}`, location)
                resolve(location)
            } catch (e) {
                reject(e)
            }
        }, opts.timeout)
    })
}