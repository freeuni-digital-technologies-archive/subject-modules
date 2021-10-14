const expect = window.chai.expect;
const assert = window.chai.assert;

describe(`სემინარი: ახალი პოსტის დადება 
    `, () => {
  describe(`პოსტები`, () => {
    const tester = new Tester();
    it(`ელემენტები: დოკუმენტს უნდა ქონდეს პოსტების ელემენტი, რომლის id 
                არის ${testConfig.postsContainerId}.

                ${testConfig.postsContainerId} ელემენტში არსებობს textarea, რომლის id არის 
                ${testConfig.postInputId}.

                ${testConfig.postsContainerId} ელემენტში არსებობს ღილაკი, რომლის
                id არის ${testConfig.newPostButton}

                ${testConfig.postsContainerId} ელემენტში დაპოსტილი პოსტებისთვის არსებობს div ელემენტი,
                რომლის id არის ${testConfig.postsFeed}

                `, () => {
      tester.getApp();
      assert.isNotNull(tester.getPostsInput());
      assert.isNotNull(tester.getPostButton());
      assert.isNotNull(tester.getPostsFeed());
    });

    it(`ამ ღილაკზე დაჭერის შემდეგ პოსტის ველში შეყვანილი ტექსტი უნდა 
                დაემატოს პოსტების ფიდში (დაპოსტილი პოსტები). 
                თითოეული პოსტისთვის შექმენით ახალი ელემენტი, რომელსაც ექნება კლასი 
                ${testConfig.post}. აქ შეგიძლიათ სხვადასხვა ელემენტები იყოს. მთავარია, 
                უშუალოდ პოსტის ტექსტის div-ს ქონდეს კლასი ${testConfig.postText}`, () => {
      return tester.postPost().then((res) => {
        assert.equal(res.typed, res.result);
      });
    });
  });
});

describe(`დავალება: username`, () => {
  const tester = new Tester();
  it(`1 ქულა. აპლიკაციაში არის input ელემენტი, 
		რომლის id არის ${testConfig.usernameInput}.`, () => {
    tester.getApp();
    assert.isNotNull(tester.getUserInput());
  });

  it(`1 ქულა. input ელემენტში სანამ მომხმარებელი ტექსტს ჩაწერს, გამოაჩინე
		კითხვა "რა გქვია?" (როგორც პოსტზე ჩანს "what's up)"`, () =>
    assert.equal(tester.getUserInput().placeholder, "რა გქვია?"));
  it(`1 ქულა. ახალი პოსტის დადების შემდეგ, ${testConfig.post} ელემენტში არის span ელემენტი, 
    	რომლის კლასი არის ${testConfig.postUser}. ელემენტში წერია იგივე, რაც 
    	${testConfig.usernameInput}-ში`, () => {
    const userName = tester.setUser();
    return tester.checkUserInput().then((res) => assert.equal(userName, res));
  });

  it(`1 ქულა. username-ის შეცვლის შემთხვევაში 
    	შემდეგ პოსტზეც შეიცვლება სახელი`, () => {
    const userName = tester.setUser();
    return tester.checkUserInput().then((res) => assert.equal(userName, res));
  });
});

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