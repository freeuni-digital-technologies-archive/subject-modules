const dogButton = document.querySelector('.like');
const dogResult = document.querySelector('.likeNum');
const commentArea = document.querySelector('.commentArea');
const commentInput = document.querySelector('.commentInput');
const commentButton = document.querySelector('.commentButton');

const busButton = document.querySelector('.busButton');
const busResult = document.querySelector('.busResult');

const examButton = document.querySelector('.examButton');
const examResult = document.querySelector('.examResult');

const auditButton = document.querySelector('.auditButton');
const auditResult = document.querySelector('.auditResult');

const wallsButton = document.querySelector('.wallsButton');
const wallsResult = document.querySelector('.wallsResult');

const tempButton = document.querySelector('.tempButton');
const tempResult = document. querySelector('.tempResult');

const giraffeButton = document.querySelector('.giraffeButton');
const giraffeResult = document.querySelector('.giraffeResult')


let dogLikes = 0, busLikes = 0, examLikes = 0, auditLikes = 0, wallsLikes = 0, tempLikes = 0, giraffeLikes = 0;

handleLike(dogButton, dogResult, dogLikes);
handleLike(busButton, busResult, busLikes);
handleLike(examButton, examResult, examLikes);
handleLike(auditButton, auditResult, auditLikes);
handleLike(wallsButton, wallsResult, wallsLikes);
handleLike(tempButton, tempResult, tempLikes)
handleLike(giraffeButton, giraffeResult, giraffeLikes)

commentButton.addEventListener('click', () => {
  commentArea.innerHTML += commentInput.value + '<br>'; 
  commentInput.value = '';
})

function handleLike(button, result, likeCounter) {
  button.addEventListener('click', () => {
    likeCounter++;
    result.innerText = likeCounter;
  })
}



const items = document.querySelectorAll(".accordion button");

function toggleAccordion() {
  const itemToggle = this.getAttribute('aria-expanded');
  
  for (i = 0; i < items.length; i++) {
    items[i].setAttribute('aria-expanded', 'false');
  }
  
  if (itemToggle == 'false') {
    this.setAttribute('aria-expanded', 'true');
  }
}

items.forEach(item => item.addEventListener('click', toggleAccordion));




var animateButton = function (e) {
  e.preventDefault;
  //reset animation
  e.target.classList.remove("animate");

  e.target.classList.add("animate");
  setTimeout(function () {
    e.target.classList.remove("animate");
  }, 700);
};

var bubblyButtons = document.getElementsByClassName("bubbly-button");

for (var i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener("click", animateButton, false);
}
