
import { filterSubmissions, finishSubmissions, sliceSubmissions } from "../src/integration";

import { Assertion, expect } from "chai";
import { Run } from "../src/runs";

import { mock, anything, when, deepEqual, instance } from "ts-mockito";
import { HwConfig } from "../src/config";
import { Attachment, Submission } from "classroom-api";



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

    it("Filter Submissions Functionality Test 1",(done) => {
        let run: Run = mock(Run);

        let submission: any = { emailId: "emailId1" };

        when(run.forceCheck(submission)).thenReturn(false);
        when(run.newSubmission(submission)).thenReturn(false);
        
        let actualInstanceOfRun = instance(run);


        expect( 0 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.true;
        
        done();
    })

    it("Filter Submissions Functionality Test 2",(done) => {
        let run: Run = mock(Run);

        let submission: any = { emailId: "emailId1" };

        when(run.forceCheck(submission)).thenReturn(true);
        when(run.newSubmission(submission)).thenReturn(false);

        let actualInstanceOfRun = instance(run);


        expect(1 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.true;

        hw.skip = [submission];

        expect(0 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.false;
        
        done();
    })

    it("Filter Submissions Functionality Test 3",(done) => {
        let run: Run = mock(Run);

        let submission: any = { emailId: "emailId1" };

        when(run.forceCheck(submission)).thenReturn(false);
        when(run.newSubmission(submission)).thenReturn(true);

        hw.skip = []
        let actualInstanceOfRun = instance(run);


        expect(1 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.true;
        
        hw.skip = [submission];

        expect(0 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.false;

        done();
    })

    it("Filter Submissions Functionality Test 4",(done) => {
        let run: Run = mock(Run);

        let submission: any = { emailId: "emailId1" };

        
        when(run.forceCheck(submission)).thenReturn(true);
        when(run.newSubmission(submission)).thenReturn(true);

        let actualInstanceOfRun = instance(run);

        hw.skip = []

        expect(1 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.true;
        
        hw.skip = [submission];

        expect(0 == filterSubmissions([submission],actualInstanceOfRun,hw).length ).to.be.false;

        done();

    });

    /*
        Finish Submissions Tests Section.

        TODO: Not finished testing
    */
    it("Finish Submissions Test ( False Force Check && Submission Does Not Qualify )",(done) => {
        const run: Run = mock(Run);

        when(run.forceCheck(anything())).thenReturn(false);
        
        const submissions: any = [
            {
                qualifies: () => { return false },
                attachment: "attach1"
            },
            {
                qualifies: () => { return false },
                attachment: "attach2"
            }
        ];

        finishSubmissions(submissions,"",null,instance(run),true,null).then(results => {
            Promise.all(results).then(retrieves => {
                for(let i=0; i < retrieves.length; i++){
                    expect(retrieves[i].attachment).to.equal(submissions[i].attachment);
                }
        
                done();
            })
        })
    })

})
