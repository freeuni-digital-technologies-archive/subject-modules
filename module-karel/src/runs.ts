import fs from 'fs'
import {Submission} from 'dt-types'
import {Partitions} from './partitions'
import {HwConfig} from './homework'
import path from 'path'
import {StudentList} from "classroom-api";
import {config} from "./config";

export interface RunOpts {
    trial?: boolean,
    restart?: boolean,
    rerun?: boolean,
    continue?: string,
    slice?: number,
    download?: boolean,
    omit?: string[]
}
export function log<T>(e: T, message: string) {
    if (process.env.NODE_ENV === 'production') {
        console.log(message)
    }
    return e
}
export const data_path = path.resolve(__dirname, `../../../data`)
const results_path = `${data_path}/output`
const submissions_path = `${data_path}/submissions`

export class Run {
    static getLastDate(submissions: Submission[]): Date {
        return submissions
            .map(s => s.timeStamp)
            .sort((a, b) => b!.getTime() - a!.getTime())[0]!
    }

    public lastRun: number
    public currentRun: number
    private logs: Date[]
    private lastRunDate: Date
    public previousRunInfo: Partitions<Submission[]>
    public moveDir: string
    private path: string
    private logFile: string
    constructor(private hw: HwConfig, public opts: RunOpts, lastRun?: number) {
        this.path = `${results_path}/${hw.id}`
        this.moveDir = `${submissions_path}/${hw.id}`
        try {
            fs.mkdirSync(this.moveDir)
        } catch (whatever) { }
        this.setUpDirs(opts)
        this.logFile = this.path + `/logs.json`
        let runs: number[] = []
        try {
            runs = Run.getPreviousRuns(this.path)
        } catch (w) { }
        this.lastRun = lastRun || (runs.length ? runs[0] : 0)
        this.currentRun = this.lastRun + 1
        try { fs.mkdirSync(results_path) } catch (whatever) { }
        try { fs.mkdirSync(this.path) } catch (whatever) { }
    
        try {
            this.logs = JSON.parse(fs.readFileSync(this.logFile, 'utf-8'))
                .map((d: string) => new Date(d))
        } catch (e) {
            this.logs = []
        }
        this.lastRunDate = this.logs[this.logs.length - 1]
        this.previousRunInfo = this.getPreviousRunInfo()
    }

    private setUpDirs(opts: RunOpts) {
        if (opts.restart) {
            try { fs.rmdirSync(this.path) } catch (w) { }
        } else if (opts.rerun && this.lastRun) {
            try { fs.rmdirSync(`${this.path}/run${this.lastRun}`) } catch (w) { }
        }
    }

    public newSubmission(s: Submission): boolean {
        if (!this.logs.length)
            return true
        return s.submittedAfter(this.lastRunDate)

    }

    public forceCheck(s: Submission): boolean {
        const previouslyCrashed = this.previousRunInfo.crashed || []
        const crashed = previouslyCrashed.filter(e => s.id == e.id)
        const force = this.hw.exceptions?.late?.includes(s.emailId) || this.hw.force?.includes(s.emailId)
        return crashed.length > 0 || force || this.hw.force?.includes(s.emailId) || false
    }

    private static getPreviousRuns(path: string) {
        return fs
            .readdirSync(path)
            .map(dirname => dirname.match(/^run(\d+)$/))
            .filter(e => e != null)
            .map(match => Number(match![1]))
            .sort((a, b) => b - a)
    }

    private getPreviousRunInfo(): Partitions<Submission[]> {
        const students = new StudentList(config.STUDENTS_DATA_PATH)
        const output: any = {}
        if (!this.lastRun) {
            return output
        }
        const dir = this.path + '/run' + this.lastRun
        fs.readdirSync(dir)
            .filter(e => e.includes('.json'))
            .forEach(file => {
                const name = file.match(/(.*)\.json/)![1]
                const contents = fs.readFileSync(dir + '/' + file, 'utf-8')
                const data: Submission[] = JSON.parse(contents)
                data.forEach(s => {
                    s.georgianName = students.getStudentByEmail(s.emailId)?.georgianName
                })
                output[name] = data
            })
        return output
    }

    logRunInfo(output: Partitions<Submission[]> | any) {
        for (let partition in output) {
            const info = output[partition].length
            if (info > 0)
                log({}, `${partition}: ${info}`)
        }
    }
    saveRunInfo(output: Partitions<Submission[]>) {
        this.logRunInfo(output)
        // if (this.opts.trial) {
        //     return
        // }
        const submissions: Submission[] = Object.values(output).flat()
        if (!submissions.length) {
            console.log('no new submissions')
            return
        }
        let outPath = this.path + '/run' + this.currentRun
        if (this.opts.trial) {
            outPath = 'tmp/'
        } else {
            fs.mkdirSync(outPath, {recursive: true})
        }
        const casted: any = output
        let length = 0
        for (let partition in output) {
            const r: Submission[] = casted[partition] // damn you typescript:( 
            const filename = `${outPath}/${partition}.json`
            length = length + r.length
            fs.writeFileSync(filename, JSON.stringify(r, null, '\t'))
        }
        const currentLastDate = Run.getLastDate(submissions)
        if (!this.logs.length || currentLastDate.getTime() > this.lastRunDate.getTime()) {
            this.logs.push(currentLastDate)
        }
        console.log(submissions.length, length)
        if (this.opts.trial)
            return
        fs.writeFileSync(this.logFile, JSON.stringify(this.logs))
    }

}
