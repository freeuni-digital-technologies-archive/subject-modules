import path from 'path'
import { getArgs, EnvOptions } from './cli'


// ამ ფაილში უნდა იყოს მხოლოდ და მხოლოდ default პარამეტრები 
// იმ ყველაფრის, რაც user-ს შეუძლია რომ გადმოაწოდოს

export const config = {
    subject: '21f შესავალი ციფრულ ტექნოლოგიებში'
}

export const env = {
    STUDENTS_DATA_PATH: `../../classroom-api/students.json`,
    CLASSROOM_CREDENTIALS_PATH: `../../classroom-api/credentials.json`,
    CLASSROOM_TOKEN_PATH: `../../classroom-api/token.json`
}

// TODO ეს არის საშინელი ფუნქცია და ვერ ვიტან
/* ანუ კლასრუმის მოდულს სანამ დააიმპორტებ მანამდე თუ 
setEnv() ფუნქცია არ გამოიძახე STUDENTS_DATA_PATH არ არის 
ხელმისაწვომი და ვერ პოულობს... თუ troubleshootს ცდილობ,
console.logს ხომ გააკეთებ და მაგ დროს გამოძახებული გაქვს
setEnv და გიჩვენებს რომ data path არის 🤡 
destroy this
*/
export function setEnv(): EnvOptions {
    Object.entries(env).map(([k, v]) => process.env[k] = path.resolve(__dirname, v))
    return getArgs()
}


// TODO ეს ფუნქცია რატომ არის
export function testerPath(hwId: string) {
    // const currHomeworkConfig: HwConfig = readHomeworkConfiguration(`${DEFAULT_HW_CONFIG_PATH}/${hwId}/${DEFAULT_HW_CONFIG_FILENAME}`);
    // const testFileName: string = currHomeworkConfig.testFileName;
    // return path.resolve(__dirname,`${DEFAULT_HW_CONFIG_PATH}/${hwId}/${testFileName}`);
    
    return path.resolve(__dirname, `../resources/${hwId}tester.js`)
}
