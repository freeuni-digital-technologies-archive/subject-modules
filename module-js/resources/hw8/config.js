const message = "\n\t\t🡻 🡻 🡻 🡻 🡻 🡻 🡻 \n🡺 🡺 🡺 🡺 ";
const message_after = "  🡸 🡸 🡸 🡸\n\t\t🡹 🡹 🡹 🡹 🡹 🡹 🡹\n";

var defaultConfig = {
  launch_automatically: true,
  comments: true,
  posts: true,
  // news_feed: true,
  login_register: true,
  intro: true
};
var config = {};
var savedConfig = JSON.parse(localStorage.getItem("config")) || {};
var configOptions = Object.keys(defaultConfig);
configOptions.forEach(
  (e) =>
    (config[e] = Object.keys(savedConfig).includes(e)
      ? savedConfig[e]
      : defaultConfig[e])
);

function toggleTests() {
  document.getElementById("testconfig").hidden = !document.getElementById(
    "testconfig"
  ).hidden;
}

var testConfig = {
  commentInputId: "comment_input_text",
  newCommentButton: "new_comment",
  commentsContainerId: "comments_container",
  commentsFeed: "comments_feed",
  comment: "comment_container",
  commentText: "comment_text",
  postInputId: "post_text",
  newPostButton: "new_post",
  postsContainerId: "post_container",
  postsFeed: "posts",
  post: "post",
  postText: "post_text",
  usernameInput: "username",
  usernameInputType: "text",
  passwordInput: "password",
  passwordInputType: "password",
  passwordRepeatInput: "repeat_password",
  registerButton: "register",
  loginButton: "login",
  commentDeleteButton: "delete_comment",
  commentLikeButton: "like_comment",
  commentLikesCount: "comment_likes_count",
  postLikesCount: "post_likes_count",
  postLikesText: "post_likes_text",
  postLikesContainer: "post_likes_container",
  postLikesInfo: "post_likes_info",
  postLikeButton: "post_like_button",
  errorMessage: "error_message",
  wrongPassword: "პაროლი არასწორია",
  noUserFound: "მომხმარებელი არ არსებობს",
  postDate: "post_date"
};

function getInput(query) {
  return document.querySelector(`input#${query}`);
}

function getButton(query) {
  return document.querySelector(`button#${query}`);
}

function randInt() {
  return Math.round(Math.random() * 10000);
}

class Tester {
  constructor() {
    this.postElem = "";
  }

  getApp() {
    this.postElem = document.getElementById("app");
  }

  getPostsFeed() {
    return this.postElem.querySelector(`div#${testConfig.postsFeed}`);
  }

  getPosts() {
    return this.postElem.querySelector(`div#${testConfig.postsContainerId}`);
  }

  getPostsInput() {
    return this.getPosts().querySelector(`textarea#${testConfig.postInputId}`);
  }

  getPostButton() {
    return this.getPosts().querySelector(`button#${testConfig.newPostButton}`);
  }

  getLastPost() {
    return this.getPostsFeed().querySelector(`div.${testConfig.postText}`);
  }

  getLastPostElem() {
    return this.getPostsFeed().querySelector(`div.${testConfig.post}`);
  }

  postPost(postText = "post") {
    const text = postText.length === 0 ? postText : postText + " " + randInt();
    this.getPostsInput().value = text;
    this.getPostButton().onclick();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = this.getLastPost().innerText;
        resolve({
          typed: text,
          result: result
        });
      }, 100);
    });
  }
  createNewPost() {
    const input = document.querySelector(`textarea#post_text`);
    input.value = randInt();
    const button = document.querySelector(`button#new_post`);
    button.onclick();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.postElem = this.getFirstPost();
        resolve(this.postElem);
      }, 1000);
    });
  }

  getPostsFeed() {
    return document.querySelector(`div#posts`);
  }

  getFirstPost() {
    return this.getPostsFeed().querySelector(`div.post`);
  }

  getCommentsFeed() {
    return this.postElem.querySelector(`div.${testConfig.commentsFeed}`);
  }

  getPostComments() {
    return this.postElem.querySelector(`div.${testConfig.commentsContainerId}`);
  }

  getCommentsInput() {
    try {
      return this.getPostComments().querySelector(
        `textarea.${testConfig.commentInputId}`
      );
    } catch (u) {
      return null;
    }
  }

  getCommentButton() {
    return this.getPostComments().querySelector(
      `button.${testConfig.newCommentButton}`
    );
  }

  getLastComment() {
    return this.getCommentsFeed().querySelector(
      `div.${testConfig.commentText}`
    );
  }
  getLastCommentElem() {
    return this.getCommentsFeed().querySelector(`div.${testConfig.comment}`);
  }

  getCommentDeleteButton() {
    return this.getLastCommentElem().querySelector(
      `button.${testConfig.commentDeleteButton}`
    );
  }

  deleteComment() {
    this.getCommentDeleteButton().onclick();
    return timeOutPromise();
  }
  postComment(postText = "comment") {
    const text = postText.length === 0 ? postText : postText + " " + randInt();
    this.getCommentsInput().value = text;
    this.getCommentButton().onclick();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = this.getLastComment().innerText;
        resolve({
          typed: text,
          result: result
        });
      }, 100);
    });
  }

  createUser(params = {}) {
    return users.create({
      username: params.username || "user" + randInt(),
      password: params.password || randInt()
    });
  }

  login(params) {
    document.getElementById(testConfig.usernameInput).value = params.username;
    document.getElementById(testConfig.passwordInput).value = params.password;
    document.getElementById(testConfig.loginButton).onclick();
    return timeOutPromise();
  }

  getPostLikes() {
    const elem = this.getFirstPost();
    const likesElem = elem.querySelector(
      `div.${testConfig.postLikesContainer}`
    );
    return {
      likes: elem,
      likesCount: elem.querySelector(`span.${testConfig.postLikesCount}`),
      likesText: elem.querySelector(`span.${testConfig.postLikesText}`)
    };
  }

  likePost() {
    const elem = this.getFirstPost();
    const likeButton = elem.querySelector(
      `button.${testConfig.postLikeButton}`
    );
    likeButton.onclick();
    return timeOutPromise();
  }
  register(params) {
    document.getElementById(testConfig.usernameInput).value = params.username;
    document.getElementById(testConfig.passwordInput).value = params.password;
    document.getElementById(testConfig.passwordRepeatInput).value =
      params.repeatPassword || params.password;
    document.getElementById(testConfig.registerButton).onclick();
    return timeOutPromise();
  }
}

function timeOutPromise(callback, timeOut = 100) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (callback) callback(resolve);
      else resolve();
    }, timeOut);
  });
}

window.config = config;
window.Tester = Tester;
window.testConfig = testConfig;
window.configOptions = configOptions;
