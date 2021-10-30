
import { filterSubmissions, sliceSubmissions } from "../src/integration";

import { expect } from "chai";
import { Run } from "../src/runs";

import { mock, anything, when, deepEqual, instance } from "ts-mockito";
import { HwConfig } from "../src/config";


const hw: HwConfig = {
    id: "hwx",
    name: "hwxname",
    deadline: "2001-01-01",
    testFileName: "testFileName",
}


describe("Integration Tests",() => {

    it("Init Test",(done) => {
        done();
    })

    it("Slice Submissions Functionality Test",(done) => {
        /* UNDEFINED SLICE */
        let slice: number | undefined = undefined;

        const submissions: any[] = [ 1, 2, 3]

        let result = sliceSubmissions(submissions,slice);

        expect( 3 == result.length ).to.be.true;

        /* MIDDLE SLICE */

        slice = 1;

        result = sliceSubmissions(submissions,slice);

        expect( 1 == result.length ).to.be.true


        /* OUTER SLICE */
        slice = 5;

        result = sliceSubmissions(submissions,slice);

        expect( 3 == result.length).to.be.true;
        
        done();
    })

    it("Filter Submissions Functionality Test",(done) => {

        let run: Run = mock(Run);

        let submission: any = { emailId: "emailId1" };

        when(run.forceCheck(submission)).thenReturn(false);
        when(run.newSubmission(submission)).thenReturn(false);
        
        let actualInstanceOfRun = instance(run);


        expect( 0 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.true;
        
        when(run.forceCheck(submission)).thenReturn(true);
        when(run.newSubmission(submission)).thenReturn(false);

        actualInstanceOfRun = instance(run);


        expect(1 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.true;

        hw.skip = [submission];

        expect(0 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.false;


        when(run.forceCheck(submission)).thenReturn(false);
        when(run.newSubmission(submission)).thenReturn(true);

        hw.skip = []
        actualInstanceOfRun = instance(run);


        expect(1 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.true;
        
        hw.skip = [submission];

        expect(0 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.false;


        when(run.forceCheck(submission)).thenReturn(true);
        when(run.newSubmission(submission)).thenReturn(true);

        actualInstanceOfRun = instance(run);

        hw.skip = []

        expect(1 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.true;
        
        hw.skip = [submission];

        expect(0 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.false;

        done();

    });

    it("Finish Submissions Tests",(done) => {
        
    })



})
