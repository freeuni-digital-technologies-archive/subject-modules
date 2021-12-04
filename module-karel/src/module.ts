import { Submission, Drive } from 'dt-types';
import { Run, log } from "./runs";
// TODO dt-types
import { Result } from 'website-tester'
import { Partitions } from "./partitions";
import {  EmailTemplate } from './templates'


export interface SubjectModule {
	downloadAtInterval: (submission: Submission, drive: Drive,  index: number, run: Run, saveFile: any) => Promise<string>,
	// ამ ორის არგუმენტები ძაან მაგარია... ჩემი შემოქმედება
	testSubmission: (testPath: string, path: string) => Promise<Result[]>,
	prepareSubmission: (path: string, testPath: string) => string,
	asynchronousTest: boolean,
	emailTemplates?: Partitions<EmailTemplate>
}

export function defaultPrepareSubmission(path: string, testPath: string): string {
	return path
}