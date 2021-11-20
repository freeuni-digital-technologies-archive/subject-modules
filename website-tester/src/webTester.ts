import webdriver, { WebDriver } from 'selenium-webdriver'
import path from "path"
import fs from 'fs'
import fse from 'fs-extra'
import firefox from 'selenium-webdriver/firefox'

// const {By, until} = webdriver

import {ChildProcess, fork} from 'child_process'

// TODO check for driver
// khokho - keeping this comment in :D
// const firefox = require('selenium-webdriver/firefox')
const options = new firefox
    .Options()
    .headless()


export interface TestConfig {
    targetFiles: string[],
    testsLocation: string,
}

export interface Result {
    passed?: boolean
    error?: boolean
    details?: string
    message: string
    score?: number
}


/**
 * WebTester is fired up for each students work
 * each instance starts new webServer instance and selenium driver(ugly but only way)
 */
export class WebTester {
    server: ChildProcess;
    driver: WebDriver;
    constructor(private testConfig: TestConfig) {
        // try {
            
                        
        // } catch (e) {
        //     throw "webdriver in use"
        // }
        this.server = fork(path.resolve(__dirname, '../lib/webServer'));
        this.driver = new webdriver.Builder()
                        .forBrowser('firefox')
                        .setFirefoxOptions(options)
                        .build()
        
        // TODO think about a way to not start each time. Without failing on looped submissions
        // maybe selenium problem on macOS? test on linux

        
    }

    async testSubmission(dir: string, replaceFile: boolean = true): Promise<Result[]> {
        // verify that index.html has the test file
        if (replaceFile) {
            fse.readdirSync(this.testConfig.testsLocation).forEach(testFile => {
                const targetLocation = `${dir}/${testFile}`
                try {
                    fs.renameSync(targetLocation, `${dir}/${testFile}.old.js`) // don't care.js.old.js
                } catch (e) {
                }
                fs.copyFileSync(`${this.testConfig.testsLocation}/${testFile}`, targetLocation)
                
            })
        }
        let allResults: Result[] = []
        for (let file of this.testConfig.targetFiles) {
            console.log('visiting')
            const results = await this.visitPage(`file://${dir}/${file}.html`)
            allResults = allResults.concat(results)
        }
        return allResults
    }

    visitPage(path: string): Promise<Result[]> {
        const timeoutError: Result[] = [{error: true, message: 'tester timeout exceeded 30 seconds'}]
        const addressInUseError: Result[] = [{message: "address in use"}]
        return (new Promise((resolve, reject) => {
            var timeout = setTimeout(() => {
                reject(timeoutError)
            }, 30000)
            this.server.on('message', (m: Result[]) => {
                clearTimeout(timeout) // so we don't wait extra 30 sec at the end
                resolve(m)
            })
            // console.log('testing file:' + path)
            this.driver.get(path)
        }))
    }

    finish(): Promise<void> {
        this.server.kill()
        return this.driver.quit()
    }
}