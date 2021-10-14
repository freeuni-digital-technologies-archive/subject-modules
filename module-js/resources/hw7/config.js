// chai.config.includeStack = false
// chai.config.showDiff = false
mocha.setup("bdd");


var testConfig = {
        newPostContainerId: 'new-post-container',
        newPostTextId: 'new-post-text',
        newPostButtonId: 'new-post-button',
        postsContainerId: 'posts-container',
        postContainerClass: 'post-container',
        postTextClass: 'post-text',
        usernameInputId: 'username-input',
        postUserClass: 'post-user',
}

function randInt() {
        return Math.round(Math.random()*10000)
}

function getById(id, type='') {
        return document.querySelector(type + '#' + id)
}

function getElem(className, elem=document, type='') {
        console.log(className, elem, type)
        return elem.querySelector('.' + className)
}
class Tester {
        constructor() {
                this.app = getById('app')
        }
        
        createAndAddPost(postText = 'post') {
                const text = postText + ' ' + randInt()
                getById(testConfig.newPostTextId).value =  text
                getById(testConfig.newPostButtonId).onclick()      
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const result = getElem(testConfig.postTextClass, this.getLastPost()).innerText
                        resolve({
                            typed: text,
                            result: result
                    })
                }, 100)
            })
        }

        getLastPost() {
                return getElem(testConfig.postContainerClass, document, 'div')
        }

        setUser(user) {
                const userName = user ? user : 'user' + randInt()
                getById(testConfig.usernameInputId).value = userName
                return userName
        }

        checkUserInput() {
                return this.createAndAddPost()
            .then(() => getElem(testConfig.postUserClass, this.getLastPost(), 'span').innerText)
        }

}
