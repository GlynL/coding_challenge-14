// ------- selectors -------------
const items = document.querySelectorAll(".item");
const itemsContent = document.querySelectorAll(".item__content");

// =============================
// ------- game setup ---------
function setupGame() {
  // contents for game items
  const results = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
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
  const content = e.target.getElementsByClassName("item__content")[0];
  // add visible class to clicked item
  content.classList.add("visible");

  if (guess === null) {
    // remove listner -- can't click self for match
    e.target.removeEventListener("click", handleClick);
    // save guess
    guess = content;
  } else {
    // check if guess a match
    handleGuess(content, e.target);
  }
}

// guessing logic
function handleGuess(content, target) {
  // correct  guess
  if (guess.innerHTML === content.innerHTML) {
    // add matched class to content
    guess.classList.add("matched");
    content.classList.add("matched");
    // remove event listners
    target.removeEventListener("click", handleClick);
    guess.parentNode.removeEventListener("click", handleClick);
    // add matched class to item
    target.classList.add("matched__item");
    guess.parentNode.classList.add("matched__item");
    // add to matches
    matches++;
    // check if won
    console.log(matches);
    if (matches === 6) gameWon();
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
  // loop over all items content
  itemsContent.forEach(item => {
    // disbale clicking
    clickToggle = false;
    // delay
    setTimeout(() => {
      // remove visible from item contents
      item.classList.remove("visible");
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
  items.forEach(item => {
    item.classList.remove("visible__item");
    item.classList.remove("matched__item");
  });

  // remove classes from items content
  itemsContent.forEach(item => {
    item.classList.remove("visible");
    item.classList.remove("matched");
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