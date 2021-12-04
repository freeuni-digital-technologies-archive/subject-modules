import { Submission } from "dt-types"
import { HwConfig } from "./homework"
import { Run, log, RunOpts } from './runs'

type S = Submission
export interface Partitions<T> {
    crashed?: T,
    notSubmitted?: T,
    late?: T,
    invalid?: T,
    error?: T,
    failed?: T,
    passed?: T,
    // rest
    none?: T
} 
 
// noinspection JSUnusedLocalSymbols
const partitions: Partitions<(s: S) => boolean | undefined> = {
    crashed: (s: S) => s.crashed,
    notSubmitted: (s: S) => !s.turnedIn(),
    late: (s: S) => !s.onTime(),
    invalid: (s: S) => s.incorrectFormat,
    error: (s: S) => s.hasErrors(),
    failed: (s: S) => !s.passed(),
    passed: (s: S) => s.passed(),
    // rest
    none: (s: S) => true
}

export function partitionResults(results: Submission[], hw: HwConfig) {
    const output: any = {}   
    Object.keys(partitions).forEach(e => output[e] = [])
    const dumb: any = partitions
    results.forEach(result => {
        if(hw.manualChecks?.includes(result.emailId)) {
            output.passed.push(result)
            return
        }
        for (let partition in partitions) {
            // noinspection JSUnfilteredForInLoop
            const p = dumb[partition]
            const dumber: any = hw.exceptions || {}
            const exceptions: string[] | undefined = dumber[partition] || []
            if (p(result) && !exceptions?.includes(result.emailId)) {
                output[partition].push(result)
                return
            }
        }
    })
    return output
}

export function mergeResults(hw: HwConfig, runOpts: RunOpts) {
    const latestRun = new Run(hw, runOpts)
    let finalResults: Submission[] = []
    for (let i = latestRun.lastRun; i > 0; i--) {
        const run = new Run(hw, runOpts, i)
        const results = run.previousRunInfo
        // save status in results
        Object.keys(results).forEach(e => {
            // შეჭამა ტვინი
            // @ts-ignore 
            results[e].map(r => r.status = e)
        })
        const merged = Object.values(results).flat()
        const newResult = (e: Submission) => !finalResults.find(r => r.emailId == e.emailId)
        const res = merged.filter(newResult)
        finalResults = finalResults.concat(res)
    }
    return finalResults
}