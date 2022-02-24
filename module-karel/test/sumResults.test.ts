import { expect } from 'chai'
import { summarizeResults } from '../src/scripts/sumResults'

const emisFileName = __dirname + '/files/sumResults/emis_list.csv'
const manualResultsFileName = __dirname + '/files/sumResults/manualResults'
describe('reading emis csv file', () => {
    const results = summarizeResults(emisFileName, manualResultsFileName)
    const list = Object.keys(results)
    it('should filter out repeating headings', () => {
        expect(list).length(7)
    })
    it('should extract emailids', () => {
        expect(list[0]).equal('sandg20')
    })
})

describe('getting list of homeworks to process', () => {
    it('homeworks described in config files', () => {
        const results = summarizeResults(emisFileName, manualResultsFileName)
        const homeworks = Object.keys(results['sandg20'])
        expect(homeworks.length).gt(0, 'did not read any homeworks')
        expect(homeworks).include('hw1')

    })
    it('homeworks and other entries in csv files', () => {
        const results = summarizeResults(emisFileName, manualResultsFileName)
        expect(results['sshar21']['hw1']).equal(1)
        expect(results['nbarb21']['hw1']).equal(3)
        expect(results['sandg20']['bonus_presentation']).equal(3)
        expect(results['sshar21']['bonus_presentation']).equal(5)
        expect(results['aniko21']['bonus_discussion']).equal(1)
        expect(results['sandg20']['bonus_discussion']).equal(4)
    })
    it('quiz results', () => {
        const results = summarizeResults(emisFileName, manualResultsFileName)
        expect(results['mobali21']['quiz1']).equal(7)
        expect(results['nbarb21']['quiz1']).equal(6)
    })
    
})