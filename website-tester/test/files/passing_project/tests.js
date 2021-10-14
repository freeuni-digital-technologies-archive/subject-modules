var testConfig = {
	postInputId: 'post_text',
	newPostButton: 'new_post',
	postsContainerId: 'post_container',
	postsFeed: 'posts',
	post: 'post',
	postText: 'post_text'
}
var expect = chai.expect
var assert = chai.assert
class Tester {
	constructor() {
		this.postElem = ''
	}

	getApp() {
		this.postElem = document.getElementById('app')	
	}

	getPostsFeed() {
		return this.postElem
		.querySelector(`div#${testConfig.postsFeed}`)
	}

	getPosts() {
		return this.postElem
		.querySelector(`div#${testConfig.postsContainerId}`)
	}

	getPostsInput() {
		return this.getPosts()
		.querySelector(`textarea#${testConfig.postInputId}`)
	}

	getPostButton() {
		return this.getPosts().querySelector(`button#${testConfig.newPostButton}`)
	}

	getLastPost() {
		return this.getPostsFeed()
			.querySelector(`div.${testConfig.postText}`)
	}

	postPost() {
		const text = Math.random()*100000
		this.getPostsInput().value = text
		this.getPostButton().onclick()		
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const result = this.getLastPost().innerText
				resolve({
					typed: text,
					result: result
				})
			}, 100)
		})
	}

}

describe(`პოსტები`, () => {
	const tester = new Tester()
	it(`ელემენტები: დოკუმენტს უნდა ქონდეს პოსტების ელემენტი, რომლის id 
		არის ${testConfig.postsContainerId}.

		${testConfig.postsContainerId} ელემენტში არსებობს textarea, რომლის id არის 
		${testConfig.postInputId}.

		${testConfig.postsContainerId} ელემენტში არსებობს ღილაკი, რომლის
		id არის ${testConfig.newPostButton}

		${testConfig.postsContainerId} ელემენტში დაპოსტილი პოსტებისთვის არსებობს div ელემენტი,
		რომლის id არის ${testConfig.postsFeed}

		`, (done) => {
				tester.getApp()
				assert.isNotNull(tester.getPostsInput())
				assert.isNotNull(tester.getPostButton())
				assert.isNotNull(tester.getPostsFeed())
				done()	
		})
	
	it(`ამ ღილაკზე დაჭერის შემდეგ პოსტის ველში შეყვანილი ტექსტი უნდა 
		დაემატოს პოსტების ფიდში (დაპოსტილი პოსტები). 
		თითოეული პოსტისთვის შექმენით ახალი ელემენტი, რომელსაც ექნება კლასი 
		${testConfig.post}. აქ შეგიძლიათ სხვადასხვა ელემენტები იყოს. მთავარია, 
		უშუალოდ პოსტის ტექსტის div-ს ქონდეს კლასი ${testConfig.postText}`, (done) => {
			tester.postPost()
			.then((res) => {
				assert.equal(res.typed, res.result)
				done()
			})
		})
})


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