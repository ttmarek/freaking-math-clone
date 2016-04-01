var state = {
  min: 1,
  max: 10,
  numA: 0,
  numB: 0,
  answer: false,
  timeLimit: 7000,
  gameOver: false,
  timeOutId: undefined,
  score: -1
}

var DOM = {
  body: document.getElementsByTagName('body')[0],
  correctBtn: document.getElementById('correct-btn'),
  incorrectBtn: document.getElementById('incorrect-btn'),
  numbers: document.getElementById('numbers'),
  result: document.getElementById('result'),
  score: document.getElementById('score-display'),
  gameOverDisplay: document.getElementById('game-over-display'),
  gameOverMsg: document.getElementById('game-over-message'),
  playAgainBtn: document.getElementById('play-again-btn'),
  lastScore: document.getElementById('last-score'),
  bestScore: document.getElementById('best-score'),
  timer: document.getElementById('timer')
}

// --------------------------------------------------
document.addEventListener('DOMContentLoaded', runFreakingMathClone)

function runFreakingMathClone () {
  DOM.correctBtn.addEventListener('click', checkIfCorrect)
  DOM.incorrectBtn.addEventListener('click', checkIfIncorrect)
  DOM.playAgainBtn.addEventListener('click', refreshPage)
  // Set a random background color
  DOM.body.style['background-color'] = getRandomColor()
  generateNewNumbers()
}

// --------------------------------------------------
function refreshPage () {
  window.location.reload()
}

function generateNewNumbers () {
  state.numA = getRandomIntInclusive(state.min, state.max)
  state.numB = getRandomIntInclusive(state.min, state.max)
  state.answer = getRandomBoolean()
  state.score = state.score + 1
  refreshUI()
}
// --------------------------------------------------
function refreshUI () {
  DOM.score.textContent = state.score
  DOM.numbers.textContent = state.numA + ' + ' + state.numB
  DOM.result.textContent = (function () {
    var sum = state.numA + state.numB
    if (state.answer === true) {
      return '= ' + sum
    } else {
      return '= ' + (function () {
        var incorrectResult = sum
        while (true) {
          incorrectResult = getRandomIntInclusive(state.min, state.max)
          if (incorrectResult != sum) {
            return incorrectResult
            break
          }
        }
      })()
    }
  })()
}

// --------------------------------------------------
function checkIfCorrect () {
  if (state.answer) {
    generateNewNumbers()
    refreshTimer()
  } else {
    endGame('Game Over')
  }
}

function checkIfIncorrect () {
  if (state.answer) {
    endGame('Game Over')
  } else {
    generateNewNumbers()
    refreshTimer()
  }
}
// --------------------------------------------------
function refreshTimer () {
  if (state.timeOutId) {        // timer running
    DOM.timer.className = ''
    window.clearTimeout(state.timeOutId)
  }
  startTimer()
}

function startTimer () {
  window.setTimeout(function () {
    DOM.timer.className = 'active'
  }, 100)
  state.timeOutId = window.setTimeout(function () {
    if (!state.gameOver) {
      endGame('Time Out')
    }
  }, state.timeLimit)
}

// --------------------------------------------------
function endGame (reason) {
  state.gameOver = true
  // Display end game message
  DOM.gameOverMsg.textContent = reason
  DOM.lastScore.textContent = state.score
  DOM.bestScore.textContent = getHighestScore()
  DOM.gameOverDisplay.className = 'on-screen'
  // Disable buttons
  DOM.correctBtn.disabled = true
  DOM.incorrectBtn.disabled = true
}

function getHighestScore () {
  var highestScore = window.localStorage.getItem('highest-score')
  if (highestScore) {
    if (highestScore < state.score) {
      window.localStorage.setItem('highest-score', state.score)
      return state.score
    } else {
      return highestScore
    }
  } else {
    window.localStorage.setItem('highest-score', state.score)
    return state.score
  }
}

// --------------------------------------------------
function getRandomColor () {    // impure
  var possibleColors = ['#16A085', '#F39C12', '#27AE60', '#D35400']
  // Why a random color from a predefined array?  Because if the
  // background color was purely random then it might generate a
  // color that would clash with the other elements on the
  // page. E.g. A randomly generated white background would make the
  // numbers hard or impossible to read.
  return possibleColors[getRandomIntInclusive(0, 3)]
}

// --------------------------------------------------

// Returns a random boolean
function getRandomBoolean () {
  return Math.random() >= 0.5
}

// Returns a random integer between min (included) and max (included)
function getRandomIntInclusive(min, max) { // impure
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
