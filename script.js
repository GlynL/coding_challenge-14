// ------- selectors -------------
const items = document.querySelectorAll(".item");
const itemsInner = document.querySelectorAll(".item__inner");
const itemsContent = document.querySelectorAll(".item__back");

// =============================
// ------- game setup ---------
function setupGame() {
  // contents for game items
  const results = [
    `<i class="fas fa-angry"></i>`,
    `<i class="fas fa-angry"></i>`,
    `<i class="fas fa-anchor"></i>`,
    `<i class="fas fa-anchor"></i>`,
    `<i class="fas fa-bomb"></i>`,
    `<i class="fas fa-bomb"></i>`,
    `<i class="fas fa-bong"></i>`,
    `<i class="fas fa-bong"></i>`,
    `<i class="fas fa-cat"></i>`,
    `<i class="fas fa-cat"></i>`,
    `<i class="fas fa-dog"></i>`,
    `<i class="fas fa-dog"></i>`,
    `<i class="fas fa-hotdog"></i>`,
    `<i class="fas fa-hotdog"></i>`,
    `<i class="fas fa-coffee"></i>`,
    `<i class="fas fa-coffee"></i>`
  ];
  // shuffled contents
  const shuffledResults = shuffle(results);
  // add a shuffled content to each game item
  itemsContent.forEach((item, i) => {
    item.innerHTML = shuffledResults[i];
  });

  // event listener for click on game item
  items.forEach(item => item.addEventListener("click", handleClick));
}

// intial setup
setupGame();

// current guess
let guess = null;

// click toggle
let clickToggle = true;

// match tracker
let matches = 0;

// ==================================
// ------- game clicks -----------

// handle click on game item
function handleClick(e) {
  // if clicks currently disabled return
  if (!clickToggle) return;
  // content of click
  const content = e.currentTarget.getElementsByClassName("item__inner")[0];
  // add visible class to clicked item
  content.classList.add("visible");

  if (guess === null) {
    // remove listner -- can't click self for match
    e.currentTarget.removeEventListener("click", handleClick);
    // save guess
    guess = content;
  } else {
    // check if guess a match
    handleGuess(content, e.currentTarget);
  }
}

// guessing logic
function handleGuess(content, target) {
  // correct  guess
  if (guess.innerHTML === content.innerHTML) {
    // add matched class to content
    guess.classList.add("matched");
    content.classList.add("matched");
    guess
      .getElementsByClassName("item__back")[0]
      .classList.add("item__back--matched");
    content
      .getElementsByClassName("item__back")[0]
      .classList.add("item__back--matched");
    // remove event listners
    target.removeEventListener("click", handleClick);
    guess.parentNode.removeEventListener("click", handleClick);

    // add to matches count
    matches++;
    // check if won
    if (matches === 8) gameWon();
  } else {
    /* incorrect guess */
    // add listener back to current guess
    guess.parentNode.addEventListener("click", handleClick);
    hideItems();
  }
  guess = null;
  incrementMoves();
}

// hide item content
function hideItems() {
  // loop over all items
  items.forEach(item => {
    // disbale clicking
    clickToggle = false;
    // delay
    setTimeout(() => {
      // remove visible from item inner
      item.getElementsByClassName("item__inner")[0].classList.remove("visible");
      // enable clicking
      clickToggle = true;
    }, 1000);
  });
}

// ============================
// ----------- timer ----------
const timer = document.querySelector(".timer");
let time = 0;

const timerInterval = setInterval(() => {
  time++;
  timer.innerHTML = time;
}, 1000);

// ============================
// --------- moves -----------
const moves = document.querySelector(".moves");
let movesCount = 0;
function incrementMoves() {
  movesCount++;
  moves.innerHTML = movesCount;
}

// ===========================
// -------- restart ----------
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", restart);

function restart() {
  // remove classes from items
  itemsInner.forEach(inner => {
    inner.classList.remove("visible", "matched");
    inner
      .getElementsByClassName("item__back")[0]
      .classList.remove("item__back--matched");
  });
  // clear guess
  guess = null;

  // reset timer
  time = 0;
  timer.innerHTML = time;

  // reset moves
  movesCount = 0;
  moves.innerHTML = movesCount;

  // basic setup
  setupGame();
}

// =========================================
// ---------- game won ---------------------
function gameWon() {
  // set modal active
  const modal = document.querySelector(".game-won");
  modal.classList.add("game-won--active");

  // set time and moves
  const modalTime = document.querySelector(".modal-time");
  const modalMoves = document.querySelector(".modal-moves");
  modalTime.innerHTML = time;
  modalMoves.innerHTML = movesCount;

  // replay button
  const replayBtn = document.querySelector(".replay");
  function replay() {
    restart();
    modal.classList.remove("game-won--active");
    replayBtn.removeEventListener("click", replay);
  }

  replayBtn.addEventListener("click", replay);
}

//===============================================
// ---------- helper functiosn -------------

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
