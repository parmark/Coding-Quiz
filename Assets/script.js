var mainText = document.getElementById("mainText");
var subText = document.getElementById("subText");
var startBtn = document.getElementById("start");
var question = document.getElementById("question");
var answerArea = document.getElementById("interactiveArea");
var answerButtons = [];
var quizIterator = 0;
var timeEl = document.getElementById("count");
var secondsLeft = 75;

var highscores = [];

var questions = [
    {
      title: "Commonly used data types DO NOT include:",
      choices: ["strings", "booleans", "alerts", "numbers"],
      answer: "alerts"
    },
    {
      title: "The condition in an if / else statement is enclosed within ____.",
      choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
      answer: "parentheses"
    },
    {
      title: "Arrays in JavaScript can be used to store ____.",
      choices: [
        "numbers and strings",
        "other arrays",
        "booleans",
        "all of the above"
      ],
      answer: "all of the above"
    },
    {
      title:
        "String values must be enclosed within ____ when being assigned to variables.",
      choices: ["commas", "curly brackets", "quotes", "parentheses"],
      answer: "quotes"
    },
    {
      title:
        "A very useful tool used during development and debugging for printing content to the debugger is:",
      choices: ["JavaScript", "terminal / bash", "for loops", "console.log"],
      answer: "console.log"
    }
  ];

init();

// Checks to see if any highscores are in local storage
function init() {
  if (JSON.parse(localStorage.getItem("highscoreList")) !== null)
  {
    highscores = JSON.parse(localStorage.getItem("highscoreList"))
  }
}

// Posts the new question and set of answers when moving to a new quiz question
function nextQuestion() {
  if (quizIterator === 5) {
    quizIterator = 0;
    endQuiz();
  }
  else {
    question.textContent = questions[quizIterator].title;
    for (i = 0; i < 4; i++) {
      answerButtons[i].textContent = questions[quizIterator].choices[i];
  }
  quizIterator++;
  }
}

// This function empties the start screen and creates buttons for the quiz answers
function startQuiz() {
  event.preventDefault();
  event.stopPropagation();
    
  mainText.textContent = "";
  subText.textContent = "";
  startBtn.remove();

  for (i = 0; i < 4; i++) {
    answerButtons[i] = document.createElement("button")
    answerButtons[i].setAttribute("class", "btn btn-primary btn-xs")
    answerArea.append(answerButtons[i])
  }
}

// This function empties the quiz area of questions and answers
// It also formats the end screen with the users' score and score submission form
function endQuiz() {
  question.textContent = "";
  for (i = 0; i < 4; i++) {
    answerButtons[i].remove();
  }

  subText.textContent = "Your final score is " + secondsLeft;
  mainText.textContent = "All done!"
  createSubmissionBox();  
}

// Sets up a functional score submission form
function createSubmissionBox() {
  var initialsEntry = document.createElement("form")
  initialsEntry.setAttribute("action", "highscores.html")
  initialsEntry.textContent = "Enter initials: "
  var submissionBox = document.createElement("input")
  var submitBtn = document.createElement("input")
  submitBtn.setAttribute("type", "submit")
            
  answerArea.append(initialsEntry);
  initialsEntry.append(submissionBox);
  initialsEntry.append(submitBtn);

  submitBtn.addEventListener("click", function(event) {
    highscores.push([submissionBox.value, secondsLeft]) 
    localStorage.setItem("highscoreList", JSON.stringify(highscores));
  })
}

// Informs the user if they were right or wrong on eash answer with a temporary html element
function resultPopUp(result) {
  var resultDivider = document.createElement("hr");
  document.body.append(resultDivider);
  var resultFeedback = document.createElement("p");
  resultFeedback.textContent = result; 
  document.body.append(resultFeedback);

  setTimeout(function() {
    resultDivider.remove();
    resultFeedback.remove();
  }, 1000)
}

// Checks the validity of the users answers
function validateAnswer(answer) {
  if (answer.target.textContent === questions[quizIterator - 1].answer){
    resultPopUp("Correct!")
  }
  else {
    resultPopUp("Wrong!")
    secondsLeft = secondsLeft - 10;
  }
}

// Starts a timer
function startTimer() {
  // Create the countdown timer.
  var timerInterval = setInterval(function () {
    if (secondsLeft < 1 ){
      timeEl.textContent = ""
      endQuiz();
      clearInterval(timerInterval)
    }
    else if (quizIterator === 0) {
      timeEl.textContent = ""
      clearInterval(timerInterval)
    }
    else {
      timeEl.textContent = secondsLeft
    }
    secondsLeft--;
  }, 1000)
}

startBtn.addEventListener("click", function(event) {
  startQuiz();
  nextQuestion();
  startTimer();
})

answerArea.addEventListener("click", function(event) {
  if (event.target.matches("button") && quizIterator !== 0) {
    validateAnswer(event);
    nextQuestion();
  }
})
