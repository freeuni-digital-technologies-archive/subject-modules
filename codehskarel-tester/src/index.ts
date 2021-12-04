import path from "path";

export * from './karelTester'
import { fork } from 'child_process'
import { Result} from "dt-types";
// tests a single submission
export function testSubmission(testFile: string, submissionFile: string, timeout: number = 2000): Promise<Result[]> {
    return new Promise((resolve) => {
        const test = fork(path.resolve(__dirname, '../lib/testSubmission'),
        ['-t', testFile, '-f', submissionFile])
        setTimeout(() => {
            test.kill('SIGINT')
            resolve([{
                error: true,
                message: 'timeout',
                details: 'there is an infinite loop in the program'
            }])
        }, timeout)
        test.on('message', (m: Result[]) => {
            resolve(m)
            test.kill('SIGINT')
        })
    })
}
