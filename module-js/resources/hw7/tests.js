
const assert = chai.assert
const expect = chai.expect

const tester = new Tester();

describe(`სემინარი: ახალი პოსტის დადება 
    `, () => {
  describe(`პოსტები`, () => {
    it(`ელემენტები: დოკუმენტს უნდა ქონდეს პოსტების ელემენტი, რომლის id 
                არის ${testConfig.newPostContainerId}.

                ${testConfig.newPostContainerId} ელემენტში არსებობს textarea, რომლის id არის 
                ${testConfig.newPostTextId}.

                ${testConfig.newPostContainerId} ელემენტში არსებობს ღილაკი, რომლის
                id არის ${testConfig.newPostButtonId}

                დაპოსტილი პოსტებისთვის არსებობს div ელემენტი,
                რომლის id არის ${testConfig.postsContainerId}

                `, () => {
      assert.isNotNull(getById(testConfig.newPostTextId, 'textarea'));
      assert.isNotNull(getById(testConfig.newPostButtonId, 'button'));
      assert.isNotNull(getById(testConfig.postsContainerId, 'div'));
    });

    it(`ამ ღილაკზე დაჭერის შემდეგ პოსტის ველში შეყვანილი ტექსტი უნდა 
                დაემატოს პოსტების ფიდში (დაპოსტილი პოსტები). 
                თითოეული პოსტისთვის შექმენით ახალი ელემენტი, რომელსაც ექნება კლასი 
                ${testConfig.postContainerClass}. აქ შეგიძლიათ სხვადასხვა ელემენტები იყოს. მთავარია, 
                უშუალოდ პოსტის ტექსტის div ელემენტიც იყოს, და მას ქონდეს კლასი ${testConfig.postTextClass}`, () => {
      return tester.createAndAddPost().then((res) => {
        assert.equal(res.typed, res.result);
      });
    });
  });
});

describe(`დავალება: username`, () => {
  it(`1 ქულა. აპლიკაციაში არის input ელემენტი, 
		რომლის id არის ${testConfig.usernameInputId}.`, () => {
    assert.isNotNull(getById(testConfig.usernameInputId, 'input'));
  });

  it(`1 ქულა. input ელემენტში სანამ მომხმარებელი ტექსტს ჩაწერს, გამოაჩინე
		კითხვა "რა გქვია?" (როგორც პოსტზე ჩანს "what's up)"`, () =>
    assert.equal(getById(testConfig.usernameInputId).placeholder, "რა გქვია?"));
  it(`1 ქულა. ახალი პოსტის დადების შემდეგ, ${testConfig.postsContainerId} ელემენტში არის span ელემენტი, 
    	რომლის კლასი არის ${testConfig.postUserClass}. ელემენტში წერია იგივე, რაც 
    	${testConfig.usernameInputId}-ში`, () => {
    const userName = tester.setUser();
    return tester.checkUserInput().then((res) => assert.equal(userName, res));
  });

  it(`1 ქულა. username-ის შეცვლის შემთხვევაში 
    	შემდეგ პოსტზეც შეიცვლება სახელი`, () => {
    const userName = tester.setUser();
    return tester.checkUserInput().then((res) => assert.equal(userName, res));
  });
});


const testResults = []

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

function getScore(test) {
    const match = test.title.match(/(.*) ქულა/)
    try {
        return Number(match[1])
    } catch(e) { return null }
}

setTimeout(() => {
    mocha.run()
        .on('pass', function (test) {
            testResults.push({
                passed: true,
                score: getScore(test),
                message: test.title
            })
        })
        .on('fail', function (test, err) {
            testResults.push({
                passed: false,
                message: test.title,
                score: getScore(test),
                failed: err.message
            })
        })
        .on('end', testRequest)
})
