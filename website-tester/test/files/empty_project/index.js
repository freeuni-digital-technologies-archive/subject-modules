var POSTID = 0

function newPost() {
	post = {
		id: getPostId(),
		text: getPostText(),
		user: getUser()
	}
	var elem = createPost(post)
	addNewPost(elem)
}

function getPostId() {
	return ++POSTID
}

function getPostText() {
	var postInputElement = document.getElementById('post_text')
	return postInputElement.value
}

function getUser() {
	var userNameElement = document.getElementById('username')
	return userNameElement.value
}

function createPost(post) {
	return `
		<div id="post-${post.id}" class="post container">
			<div class="post_title">
				${post.user}
			</div>
			<div class="post_text">
				${post.text}
			</div>
			${createPostLikes()}
		</div>
	`
}

function createPostLikes() {
	return `
		<div class="post_likes_container">
			<div class="post_likes_info">
				<span class="post_likes_count">
					0
				</span> 
				likes
			</div>
			<button class="post_like_button" onclick="newLike(${post.id})">
				like
			</button>
		</div>
	`
}

function newLike(postId) {
	var postElem = document.getElementById(`post-${postId}`)
	var postLikes = postElem.querySelector('div.post_likes_info')
	var postLikesCountElem = postLikes.querySelector('span.post_likes_count')
	var postLikesCount = Number(postLikesCountElem.innerText)
	postLikesCountElem.innerText = ++postLikesCount
}

function addNewPost(elem) {
	var posts = document.getElementById('posts')
	var post = document.createElement('div')
	post.innerHTML = elem
	posts.insertAdjacentElement('afterbegin', post)
}
