// https://stackoverflow.com/questions/14874208/how-to-access-and-test-an-internal-non-exports-function-in-a-node-js-module
import rewire from 'rewire'
import { Karel } from 'jskarel'
import fs from 'fs'
import { Config } from 'dt-types'

const customStuctures:any[] = [
    // {
    //     regex: /repeat\s*\((\s*[\d|\w]+\s*)\)/g,
    //     replace: (match: RegExpMatchArray) => `for (let i=0; i < ${match[1]}; i++)`
    // },
    // {
    //     regex: /return\(\)/g,
    //     replace: () => `repeatFunction()`
    // },
    // {
    //     regex: /switch\(\)/g,
    //     replace: () => `switchFunction()`
    // }
]
function replaceCustomStructures(fileName: string) {
    let contents = fs.readFileSync(fileName, 'utf8')
    const newFile = fileName + '.fixed'
    // let functionsStart = contents.indexOf('\nfunction')
    // if (functionsStart < 0) functionsStart = contents.length
    // const commands = contents.substr(0, functionsStart)
    // contents = `function main() {
    //     ${commands}
    // }
    // ${contents.substr(functionsStart, contents.length)}
    // `
    const replaced = customStuctures.map(structure => {
        const regex = structure.regex
        if (contents.match(regex) == null)
            return false
        const matches = [...contents['matchAll'](regex)]
        matches.forEach(match => {
            const replacement = structure.replace(match)
            contents = contents.replace(match[0], replacement)
        })
        return true
    })
    // with codehs it's always a new file because of function main()
    fs.writeFileSync(newFile, contents)
    return newFile
}
export function setUpSubmission(fileName: string, config: Config = {}) {
    const newFile = replaceCustomStructures(fileName)
    const submission = rewire(newFile)
    const world = config.world || {}
    const karelConfig = config.karel || {}
    karelConfig.world = world
    const karel = new Karel(karelConfig)
    const main = submission.__get__('start')
    submission.__set__('move', () => karel.move())
    submission.__set__('turnLeft', () => karel.turnLeft())
    submission.__set__('takeBall', () => karel.pickBeeper())
    submission.__set__('putBall', () => karel.putBeeper())
    submission.__set__('frontIsClear', () => karel.frontIsClear())
    submission.__set__('ballsPresent', () => karel.beepersPresent())
    submission.__set__('noBallsPresent', () => karel.noBeepersPresent())
    submission.__set__('frontIsBlocked', () => karel.frontIsBlocked())
    submission.__set__('facingEast', () => karel.facingEast())
    submission.__set__('facingWest', () => karel.facingWest())
    submission.__set__('facingNorth', () => karel.facingNorth())
    submission.__set__('facingSouth', () => karel.facingSouth())
    submission.__set__('notFacingEast', () => !karel.facingEast())
    submission.__set__('notFacingWest', () => !karel.facingWest())
    submission.__set__('notFacingNorth', () => !karel.facingNorth())
    submission.__set__('notFacingSouth', () => !karel.facingSouth())
    submission.__set__('leftIsClear', () => karel.leftIsClear())
    submission.__set__('leftIsBlocked', () => !karel.leftIsClear())
    submission.__set__('rightIsClear', () => karel.rightIsClear())
    submission.__set__('rightIsBlocked', () => !karel.rightIsClear())
    
	 // codehs SuperKarel
    submission.__set__('turnRight', () => karel.turnRight())
    submission.__set__('turnAround', () => karel.turnAround())

    return {
        main: main,
        karel: karel,
        world: world
    }
} 
