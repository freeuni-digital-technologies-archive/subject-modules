function newPost() {
	var text = getPostText()
	var elem = createPost(text)
	addNewPost(elem)
}

function getPostText() {
	var postInputElement = document.getElementById('post_text')
	return postInputElement.value
}

function createPost(text) {
	return `
		<div class="post">
			<div class="post_text">
				${text}
			</div>
		</div>
	`
}

function addNewPost(elem) {
	var posts = document.getElementById('posts')
	var post = document.createElement('div')
	post.innerHTML = elem
	posts.insertAdjacentElement('afterbegin', post)
}