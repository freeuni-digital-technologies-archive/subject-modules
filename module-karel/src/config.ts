import path from 'path'
import { ArgumentParser } from 'argparse'
import { Partitions } from './partitions'
import { RunOpts } from './runs'
export const config = {
    subject: '21f შესავალი ციფრულ ტექნოლოგიებში'
}
export const env = {
    STUDENTS_DATA_PATH: `../../classroom-api/students.json`,
    CLASSROOM_CREDENTIALS_PATH: `../../classroom-api/credentials.json`,
    CLASSROOM_TOKEN_PATH: `../../classroom-api/token.json`
}

/* Default Directory For Homework Configuration Files */
const DEFAULT_HW_CONFIG_PATH: string =  `../../hwConfigs`;

interface EnvOptions {
    hw: HwConfig,
    slice?: number,
    download: boolean,
    runOpts: RunOpts
}

export function getArgs(): EnvOptions {
    const parser = new ArgumentParser({
        addHelp: true
    })
    parser.addArgument(['-w', '--hw'], {help: 'id of the homework'})
    parser.addArgument(['-s', '--slice'], {help: 'check first n homeworks'})
    parser.addArgument(['-t', '--trial'], {help: 'dont save output/print emails not send'})
    parser.addArgument(['-d', '--download'], {help: 'whether to download or use existing file'})
    parser.addArgument(['-e', '--restart'], {help: 'not working: delete all previous run data'})
    parser.addArgument(['-r', '--rerun'], {help: 'not working: delete previous run data'})
    parser.addArgument(['-c', '--continue'], {help: 'continue from userId'})
    parser.addArgument(['-o', '--omit'], {help: 'skip all in category'})
    parser.addArgument(['-f', '--force'], {help: 'force check of id'})
    parser.addArgument(['-k', '--skip'], {help: 'skip check of id'})
    parser.addArgument(['-l', '--late'], {help: 'ignore late of id'})
    const args = parser.parseArgs()
    const hwId: string = args['hw']

    if (!hwId) {
        console.log('provide submission id')
        process.exit(1)
    }

    /* Configuration Folder Path */
    let configPath: string = args['config-path']
    if (!configPath) {
        configPath = `${DEFAULT_HW_CONFIG_PATH}/${hwId}/config.js`;
    }

    const hwConfig = readHomeworkConfiguration(configPath);

    if (!hwConfig) {
        console.log('provide valid submission id')
        process.exit(1)
    }
    let download = true
    if (args.download == 'false') {
        download = false
    }
    const omit: string[] = (args.omit || '').split(',')
    const force = args.force?.split(',')
    if (force && force.length) {
        if (! hwConfig.force) {
            hwConfig.force = []
        }
        hwConfig.force = hwConfig.force.concat(force)
    }
    const skip = args.skip?.split(',')
    if (skip) {
        if (!hwConfig.skip) {
            hwConfig.skip = []
        }
        hwConfig.skip = hwConfig.skip.concat(skip)
    }
    const late = args.late?.split(',')
    if (late) {
        if (!hwConfig.exceptions ) {
            hwConfig.exceptions = {}
        }
        if (!hwConfig.exceptions.late) {
            hwConfig.exceptions.late = []
        }
        hwConfig.exceptions.late = hwConfig.exceptions.late.concat(late)
    }
    return {
        hw: hwConfig,
        slice: args.slice,
        download: download,
        runOpts: {
            trial: args.trial == 'true',
            restart: args.restart == 'true',
            rerun: args.rerun == 'true',
            continue: args.continue,
            omit: omit
        }
    }
}
export function setEnv(): EnvOptions {
    Object.entries(env).map(([k, v]) => process.env[k] = path.resolve(__dirname, v))
    return getArgs()
}

export function testerPath(hwId: string) {
    return path.resolve(__dirname, `../resources/${hwId}tester.js`)
}

export function getCurrentHWs() {
    var now = new Date()
    var aWeekAfterNow = new Date()
    aWeekAfterNow.setDate(aWeekAfterNow.getDate()+10)
    return homeworks.map(hw => {
        if(hw.deadlineMinutes === undefined)
            hw.deadlineMinutes = 'T23:59:59+04:00'
        return hw
    }).filter(hw => {
        var deadline = new Date(hw.deadline+hw.deadlineMinutes)
        return now <= deadline && deadline < aWeekAfterNow
    })
}

export interface HwConfig {
    id: string,
    name: string,
    deadline: string, //YYYY-mm-dd preferably
    testFileName: string,
    deadlineMinutes?: string, //T23:59:00+04:00 if not set 
    exceptions?: Partitions<string[]>,
    manualChecks?: string[],
    force?: string[],
    skip?: string[],
}
export const homeworks: HwConfig[] = [
    {
        id: 'hw1',
        name: 'დავალება 1',
        deadline: '2021-10-10',
        testFileName: 'hw1tester.js'
    },
    {
        id: 'hw2',
        name: 'დავალება 2',
        deadline: '2021-10-14',
        testFileName: 'hw2tester.js',

    },
    {
        id: 'hw3',
        name: 'დავალება 3',
        deadline: '2021-10-21',
        testFileName: 'hw3tester.js',
    },
    {
        id: 'hw4',
        name: 'დავალება 4',
        deadline: '2021-10-28',
        testFileName: 'hw4tester.js'
    },
 //   {
 //       id: 'bonus1',
 //       name: 'ბონუსი 1',
 //       deadline: '2021-9-29'
 //   },
 //   {
 //       id: 'hw3',
 //       name: 'დავალება 3 დაფის შევსება',
 //       deadline: '2020-10-13'
 //   },
 //   {
 //       id: 'hw4',
 //       name: 'დავალება 4 თაღების შეკეთება',
 //       deadline: '2020-10-20',
 //   },
 //   {
 //       id: 'bonus-middle',
 //       deadline: '2021-9-29',
 //       name: 'ბონუსი-შუა წერტილი (3%)'
 //   },
 //   {
 //       id: 'bonus-diagonal',
 //       deadline: '2021-9-29',
 //       name: 'ბონუსი - დიაგონალები (3%)',
 //   }
];



/* Homework Configuration Property Interface */
type HwConfigProperty = {
    name: string,
    type: string
}

const properHwConfigProperties: HwConfigProperty[] = [
    {
        name: "id",
        type: "string"
    },
    {
        name: "classroomName",
        type: "string"
    },
    {
        name: "deadline",
        type: "string"
    },
    {
        name: "testFileName",
        type: "string"
    },
    {
        name: "emailTemplate",
        type: "function"
    },
];


/* Message Constructors for not existence properties and invalid properties */

function printPropertyDoesNotExistMessage(propertyName: string){
    console.log(`Config object does not have '${propertyName}' property`);
}
function printPropertyIllegalTypeMessage(propertyName: string, propertyType: string){
    console.log(`Property '${propertyName}' should be type of '${propertyType}'`);
}

/* Checks if given configuration of homework is valid */

function checkGivenHwConfigroperties(preHwConfig: any){
    if(!preHwConfig){
        console.log("Could not find config object in configuration file");
        process.exit(-1);
    }

    properHwConfigProperties.forEach(currentConfigProperties => {
        let {name , type} = currentConfigProperties;

        if(!preHwConfig.hasOwnProperty(name)){
            printPropertyDoesNotExistMessage(type);
            process.exit(-1);
        }
        if(typeof preHwConfig[name] != type){
            printPropertyIllegalTypeMessage(name,type);
            process.exit(-1);
        }
    })
}

/* Convert given configuration file to local interface (Locally interface will be deleted soon) */

function convertGivenHwConfigToInterface(preHwConfig: any){
    const rvConfig: HwConfig = { 
        id: preHwConfig.id, 
        name: preHwConfig.classroomName, 
        deadline: preHwConfig.deadline, 
        testFileName: preHwConfig.testFileName 
    };
    return rvConfig;
}

function readHomeworkConfiguration(configPath: string): HwConfig {
    const configFile = require(configPath);
    if(!configFile){
        console.log("Could not find homework configuration file");
        process.exit(-1);
    }

    const preHwConfig = configFile.config;
    checkGivenHwConfigroperties(preHwConfig);

    return convertGivenHwConfigToInterface(preHwConfig);
}