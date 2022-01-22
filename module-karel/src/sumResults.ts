import fs from 'fs'
import path from 'path'
import { data_path } from './runs'
import { DEFAULT_HW_CONFIG_PATH, readHomeworkConfiguration } from './homework'
import { mergeResults } from './partitions'


const defaultHwPath = path.resolve(__dirname, DEFAULT_HW_CONFIG_PATH)
const defaultEmisPath = data_path + '/emis.csv'
const defaultManualResultsPath = data_path + '/manualResults'

const defaultScore = 4

/**
 * მოაგროვებს ყველა დავალების ბოლო შედეგს და
 * დაამატებს/გადაწერს ხელით შეყვანილ ქულებს csv ფაილებში
 */
export function summarizeResults(
    emisFileName: string = defaultEmisPath,
    manualResultsPath: string = defaultManualResultsPath,
    homeworksPath: string = defaultHwPath) {
    const studentNames = readStudentList(emisFileName)
    const results: any = {}
    studentNames.forEach(s => results[s] = {sum: 0})
    addHomeworkResults(results, studentNames, homeworksPath)
    addManualResults(results, studentNames, manualResultsPath)
    studentNames.forEach(emailId => {
        const studentResults = results[emailId]
        studentResults.sum = Object.values(studentResults).reduce((a: any, b: any) => a+b, 0)
    })
    return results;
}

function addManualResults(results: any, studentNames: String[], manualResultsPath: string) {
    fs
        .readdirSync(manualResultsPath)
        .filter(f => f.includes('.csv'))
        .forEach(f => {
            if (f.includes("quiz")) {
                addQuizCsvResults(results, studentNames, manualResultsPath, f)
            } else {
                addSimpleCsvResults(results, studentNames, manualResultsPath, f)
            }
        })
}

function addSimpleCsvResults(results: any, studentNames: String[], manualResultsPath: string, resultsFile: string) {
    const name = resultsFile.split('.')[0]
    studentNames.forEach(n => {
        // @ts-ignore
        if (!results[n][name]) {
            // @ts-ignore
            results[n][name] = 0
        }
    })
    readCsv(manualResultsPath, resultsFile)
        .forEach(line => {
            const emailId = line[0].toLowerCase()
            const score = Number(line[1])
            if (studentNames.includes(emailId)) {
                results[emailId][name] = score
            }
        })
}

function readCsv(manualResultsPath: string, resultsFile: string) {
    return fs.readFileSync(`${manualResultsPath}/${resultsFile}`, 'utf-8')
        .split('\n')
        .filter(l => l != '')
        .map(l => l.split(','));
}

function addQuizCsvResults(results: any, studentNames: String[], manualResultsPath:string, resultsFile: string) {
    const quizId = resultsFile.split('quiz ')[1].split('-')[0]
    const name = 'quiz' + quizId
    // @ts-ignore
    studentNames.forEach(n => results[n][name] = 0)
    readCsv(manualResultsPath, resultsFile)
        .forEach(line => {
            const emailId = line[4].split('@')[0].toLowerCase()
            const score = Number(line[9])
            if (studentNames.includes(emailId)) {
                results[emailId][name] = score
            }
        })
}

function addHomeworkResults(results: any, studentNames: string[], homeworksPath: string) {
    fs
        .readdirSync(homeworksPath, { withFileTypes: true })
        .filter(f => f.isDirectory() && !f.name.startsWith('.'))
        .map(dir => dir.name)
        .map(hwName => {
            const hwPath = `${homeworksPath}/${hwName}/config.js`
            const hw = readHomeworkConfiguration(hwPath)
            studentNames.forEach(s => results[s][hw.id] = 0)
            const hwResults = mergeResults(hw, {})
            hwResults
            .filter(r => studentNames.includes(r.emailId))
            .forEach(r => {
                if (r.status == 'passed') {
                    results[r.emailId][hw.id] = defaultScore 
                } else if (r.status == 'failed') {
                    const score = r.results.filter(t => t.passed).length / r.results.length * defaultScore
                    results[r.emailId][hw.id] = score
                } else {
                    results[r.emailId][hw.id] = 0
                }
            })
        })
}

function readStudentList(emisFileName: string) {
    return fs.readFileSync(path.resolve(emisFileName), 'utf-8')
        .split('\n')
        .filter(line => line.length > 0)
        .filter(line => !line.startsWith('"სახელი'))
        .map(line => line.split(',')[1])
        .map(email => email.split('@')[0])
}
/**
 * დაითვლის შედეგების ქულებს
 */

function convertToCsv(resultsList: any) {
    let studentNames = readStudentList(defaultEmisPath)
    let hwList = Object.keys(resultsList[studentNames[0]]).join(',')
    let csv = `emailId,` + hwList + '\n'
    csv += studentNames.map(emailId => {
        const entries = resultsList[emailId]
        const results = Object.values(entries)
        return  `${emailId},${results.join(',')}`
    }).join('\n')
    return csv
}
if (require.main == module) {
    console.log(convertToCsv(summarizeResults()))
}