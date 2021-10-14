var expect = chai.expect
var assert = chai.assert


const tester = new Tester()
describe(`2 ქულა. ავტორიზაცია`, () => {
   // it.skip(``, () => {})
   describe(`საწყისი კოდი`, () => {
      it(`ავტორიზაციის გვერდზე არსებობს users ბაზა, რომელიც შენახულია ცვლადში users`, () => {
        expect(users.collectionName).equal('users')
      })
      it(`გვერდზე არსებობს input ელემენტი, რომლის id არის 
        ${testConfig.usernameInput}. ელემენტის type არის ${testConfig.usernameInputType}`, () => {
         expect(getInput(testConfig.usernameInput).type).equals(testConfig.usernameInputType)
      })
      it(`გვერდზე არსებობს input ელემენტი, რომლის id არის 
        ${testConfig.passwordInput}. ელემენტის type არის ${testConfig.passwordInputType}`, () => {
         expect(getInput(testConfig.passwordInput).type).equals(testConfig.passwordInputType)
      })
      it(`გვერდზე არსებობს ღილაკი, რომლის id არის 
        ${testConfig.loginButton}.`, () => {
         assert.isNotNull(getButton(testConfig.loginButton))
      })
      it.skip(`${testConfig.loginButton} ღილაკზე დაჭერის კოდი გაკეთებული გვაქვს სემინარზე.
        პროექტში არ არის საჭირო ფანჯრის ლოკაციის კოდში რამის შეცვლა`)
   })

   describe(`ux დამატებები`, () => {
      it(`საიტზე არსებობს div ელემენტი, რომლის id არის ${testConfig.errorMessage} 
         და თავიდან ცარიელია`, () => {
          const elem = document.getElementById(testConfig.errorMessage)
          assert.isNotNull(elem)
          expect(elem.innerText).eql('')
      })
      it(`1 ქულა. თუ მომხმარებლის შეყვანილი პაროლი არ არის სწორი, ${testConfig.errorMessage}
        ელემენტში უნდა დაეწეროს ტექსტი '${testConfig.wrongPassword}'`, () => {
          const user = tester.createUser()
          user.password = 'wrongPassword'
          return tester.login(user).then(() => {
            const elemContent = document.getElementById(testConfig.errorMessage).innerText
            expect(elemContent).eql(testConfig.wrongPassword)
          })
      })
      it(`1 ქულა. თუ მომხმარებლის შეყვანილი username არ არსებობს, ${testConfig.errorMessage}
        ელემენტში უნდა დაეწეროს ტექსტი ${testConfig.noUserFound}`, () => {
          const user = tester.createUser()
          users.clear()
          return tester.login(user).then(() => {
            const elemContent = document.getElementById(testConfig.errorMessage).innerText
            expect(elemContent).eql(testConfig.noUserFound)
          })
      })
   })

   it.skip(`რეგისტრაციასთან დაკავშირებული ტესტები არის register.html გვერდზე `)
})


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
