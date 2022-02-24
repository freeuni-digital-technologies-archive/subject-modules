import * as fileReader from './karelFileReader'
import { Result, Config } from 'dt-types'


function getFileReaderError(err: any): Result {
    const result: Result = {
        error: true,
        message: "there is a problem with the file",
        details: ''
    }
    const errLine = err.message.split('\n')[0]
    const lineNumber = errLine.split(':')[1]
    if (err.name == "SyntaxError") {
        result.details = `error reading the file on line ${lineNumber}`
    } else if (err.name == 'ReferenceError' && err.message.includes('main is not defined')) {
        result.details = `could not find function main() {} in the file.`
    } else {
        result.details = `Unknown error occured: ${errLine}, ${err.message}`
    }
    return result
}

export class KarelTester {
    private config: Config[]
    private assertions: any[]
    constructor(testFile: string) {
        const { config, assertions } = require(testFile)
        this.config = config.length ? config : [config]
        this.assertions = assertions
    }

    testSubmission(submissionFile: string) {
        const results: Result[] = []
        this.config.forEach(config => {
            try {
                const { main, karel } = fileReader.setUpSubmission(submissionFile, config)
                try {
                    main()
                    this.assertions.map(assertion => {
                        try {
                            const res = assertion(karel).__flags
                            const result = {
                                passed: true,
                                message: res.message
                            }
                            results.push(result)
                        } catch (err) {
                            const result = {
                                passed: false,
                                // @ts-ignore
                                message: err.message
                            }
                            results.push(result)
                        }
                    })
                } catch (err) {
                    const result = {
                        error: true,
                        message: "there is a bug in the program",
                        details: `${err}, ${karel}`,
                    }
                    results.push(result)
                }
            } catch (err) {
                results.push(getFileReaderError(err))
            }

        })
        return results
    }
}