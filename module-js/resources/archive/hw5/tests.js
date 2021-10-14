const expect = window.chai.expect;

describe("მაგალითი. ", () => {
  it("2-ის ჩათვლით არის 1 ლუწი რიცხვი.", () => {
    expect(window.countEven(2)).eql(1);
  });
  it("1-მდე (0ს თუ არ ჩავთვლით) არ არის ლუწი რიცხვი", () => {
    expect(window.countEven(1)).eql(0);
  });
  it("5-მდე კი ორია (2, 4)", () => {
    expect(window.countEven(5)).eql(2);
  });
  it.skip("შემოწმებისას შემთხვევით შერჩეულ რიცხვზეც შევამოწმებთ");
});

describe("დავალება 1. countDivisors", () => {
  describe("დამხმარე ტესტი. isDivisor ფუნქციის შემოწმება", () => {
    it("isDivisor(5, 1) უნდა იყოს true (ნებისმიერი რიცხვი იყოფა 1-ზე", () => {
      expect(window.isDivisor(5, 1)).be.true;
    });
    it("isDivisor(4, 2) უნდა იყოს true", () => {
      expect(window.isDivisor(4, 2)).be.true;
    });
    it("5 კი არ იყოფა 3-ზე", () => {
      expect(window.isDivisor(5, 3)).be.false;
    });
  });
  describe("2 ქულა. იპოვე რიცხვის გამოყოფების რაოდენობა", () => {
    it("0.5 ქულა. 1-ს აქვს 1 გამყოფი", () => {
      expect(window.countDivisors(1)).eql(1);
    });
    it("0.5 ქულა. 4-ს აქვს 3 გამყოფი", () => {
      expect(window.countDivisors(4)).eql(3);
    });
    it("1 ქულა. 7-ს აქვს 2 გამყოფი", () => {
      expect(window.countDivisors(7)).eql(2);
    });
  });
});

describe("დავალება 2. ხმების დათვლა", () => {
  it.skip(`გაითვალისწინეთ, რომ იმისთვის, რომ ეს ამოცანა ჩაგეთვალოთ, აუცილებელია
  კოდი ქვემოთ მოცემულ ორივე ტესტს გადიოდეს (მარტო 1 ქულა არ ჩაითვლება)`, () => {});
  it("1 ქულა. მივიღეთ 35 ხმა, სასურველი იყო მინიმუმ 24. ამიტომ ვწერთ 35-ს", () => {
    expect(window.countVotes(35, 24)).eql(35);
  });
  it("1 ქულა. მივიღეთ 56 ხმა. სასურველი იყო მინიმუმ 383. ამიტომ ვზრდით ხმების რაოდენობას", () => {
    expect(window.countVotes(56, 383)).gte(383);
  });
});
// window.mocha.run();


function testRequest() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:3939', true);

//Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            console.log(xhr.response)
        }
    }
    xhr.send(JSON.stringify(testResults));
// xhr.send(new Int8Array());
// xhr.send(document);
}

const testResults = []
// TODO better message
window.onload = ()=>{
  setTimeout(() => {
      mocha.run()
      .on('pass', function (test) {
          testResults.push({
              passed: true,
              message: test.title
          })
      })
      .on('fail', function (test, err) {
          testResults.push({
              passed: false,
              message: test.title,
              error: err.message
          })
      })
      .on('end', testRequest)
  }, 200)
}