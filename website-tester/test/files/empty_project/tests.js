var testConfig = {
	commentInputId: 'comment_input_text',
	newCommentButton: 'new_comment',
	commentsContainerId: 'comments_container',
	commentsFeed: 'comments_feed',
	comment: 'comment_container',
	commentText: 'comment_text'
}
var expect = chai.expect
var assert = chai.assert
class Tester {
	constructor() {
		this.postElem = ''
	}

	createNewPost() {
		const input = document.querySelector(`textarea#post_text`)
		input.value = Math.random()*1000
		const button = document.querySelector(`button#new_post`)
		button.onclick()
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				this.postElem = this.getFirstPost()
				resolve(this.postElem)
			}, 1000)
		})
		
	}

	getPostsFeed() {
		return document.querySelector(`div#posts`)
	}

	getFirstPost() {
		return this.getPostsFeed()
		.querySelector(`div.post`)
	}

	getCommentsFeed() {
		return this.postElem
		.querySelector(`div.${testConfig.commentsFeed}`)
	}

	getPostComments() {
		return this.postElem
		.querySelector(`div.${testConfig.commentsContainerId}`)
	}

	getCommentsInput() {
		try { return this.getPostComments()
		.querySelector(`textarea.${testConfig.commentInputId}`)}
		catch (u) { return null }
	}

	getCommentButton() {
		return this.getPostComments()
		.querySelector(`button.${testConfig.newCommentButton}`)
	}

	getLastComment() {
		return this.getCommentsFeed()
			.querySelector(`div.${testConfig.commentText}`)
	}
	postComment() {
		const text = Math.random()*100000
		this.getCommentsInput().value = text
		this.getCommentButton().onclick()
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const result = this.getLastComment().innerText
				resolve({
					typed: text,
					result: result
				})
			}, 100)
		})
	}

}

const message = '\n\t\t🡻 🡻 🡻 🡻 🡻 🡻 🡻 \n🡺 🡺 🡺 🡺 '
const message_after = '  🡸 🡸 🡸 🡸\n\t\t🡹 🡹 🡹 🡹 🡹 🡹 🡹\n'
describe(`კომენტარები`, () => {
	const tester = new Tester()
	it(`ელემენტები: პოსტს უნდა ქონდეს კომენტარების ელემენტი, რომლის კლასი 
		არის ${testConfig.commentsContainerId}.

		${testConfig.commentsContainerId} ელემენტში არსებობს textarea, რომლის კლასი არის 
		${testConfig.commentInputId}.

		${testConfig.commentsContainerId} ელემენტში არსებობს ღილაკი, რომლის
		კლასი არის ${testConfig.newCommentButton}

		${testConfig.commentsContainerId} ელემენტში დაპოსტილი კომენტარებისთვის არსებობს div ელემენტი,
		რომლის კლასი არის ${testConfig.commentsFeed}

		`, () => {
			return tester.createNewPost()
			.then((post) => {
				console.log(post)
				expect(post, '\nახალი პოსტი ვერ დაიდო.').to.not.be.a('null')
				assert.isNotNull(tester.getCommentsInput(), `${message} ${testConfig.commentInputId} არ არსებობს${message_after}`)
				assert.isNotNull(tester.getCommentButton(), `${message} ${testConfig.newCommentButton} არ არსებობს${message_after}`)
				assert.isNotNull(tester.getCommentsFeed(), `${message} ${testConfig.commentsFeed} არ არსებობს${message_after}`)	
			})
		})
	
	it(`ამ ღილაკზე დაჭერის შემდეგ კომენტარის ველში შეყვანილი ტექსტი უნდა 
		დაემატოს კომენტარების ფიდში (დაპოსტილი კომენტარები). 
		თითოეული კომენტარისთვის შექმენით ახალი ელემენტი, რომელსაც ექნება კლასი 
		${testConfig.comment}. აქ შეგიძლიათ სხვადასხვა ელემენტები იყოს. მთავარია, 
		უშუალოდ კომენტარის ტექსტის div-ს ქონდეს კლასი ${testConfig.commentText}`, (done) => {
			tester.postComment()
			.then((res) => {
				assert.equal(res.typed, res.result, )
				done()
			})
		})
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