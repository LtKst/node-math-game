const socket = io();

const question = document.getElementById("question");
const answer = document.getElementById("answer");
const result = document.getElementById("result");
const level = document.getElementById("level");
const timer = document.getElementById("timer");

const correctBar = document.getElementById("correctBar");
const incorrectBar = document.getElementById("incorrectBar");

const multiplicationDot = " &#183; ";

var stage = 0;
var timeLeft = 30;

var values = [];
var correctAnswer = 0;

var gotAnswer = false;

var correct = 0;
var incorrect = 0;
var score = 0;

function NextQuestion() {
  gotAnswer = false;

  timeLeft = 30;
  timer.innerHTML = "<br />&#128336;" + timeLeft;

  answer.value = "";

  result.innerHTML = "Result: -<br />Correct answer was: -";

  values[0] = GetRandomInt(1, 10);
  values[1] = GetRandomInt(1, 10);
  values[2] = GetRandomInt(1, 10);

  if (stage < 10) {
    question.innerHTML = values[0] + multiplicationDot + values[1] + " = ?";
    correctAnswer = values[0] * values[1];
  } else if (stage < 20) {
    question.innerHTML = values[0] + multiplicationDot + "?" + " = " + values[0] * values[1];
    correctAnswer = values[0] * values[1] / values[0];
  } else if (stage < 30) {
    question.innerHTML = values[0] + " + " + values[1] + multiplicationDot + values[2] + " = ?";
    correctAnswer = values[0] + values[1] * values[2];
  } else if (stage < 40) {
    question.innerHTML = values[0] + " + " + values[1] + multiplicationDot + "? = " + (values[0] + values[1] * values[2]);
    correctAnswer = values[2];
  } else {
    var name = prompt("Enter your name if you'd like to submit your score", "Gabe Newell");

    if (name != null && name != "") {
      socket.emit("recieveHighScore", name + "-" + score);
    }

    location.reload();
  }
}

function RecieveAnswer(answer) {
  gotAnswer = true;

  if (answer == correctAnswer) {
    correct++;

    score += 5 + timeLeft;

    result.innerHTML = "Result: <span class='correct'>Correct</span><br />Correct answer was: -";
  } else {
    incorrect++;

    result.innerHTML = "Result: <span class='incorrect'>Incorrect</span><br />Correct answer was: " + correctAnswer;
  }

  stage++;
  level.innerHTML = "<p>Level: " + stage + "</p>";

  UpdateResultPercentage();
}

function UpdateResultPercentage() {
  correctPercentage = 100 / (correct + incorrect) * correct;

  correctBar.style.width = correctPercentage + "%";
  correctBar.innerHTML = Math.round(correctPercentage) + "%";

  incorrectBar.style.width = 100 - correctPercentage + "%";
  incorrectBar.innerHTML = Math.round(100 - correctPercentage) + "%";
}

function Timer() {
  if (!gotAnswer) {
    if (timeLeft > 0) {
      timeLeft--;
    } else {
      RecieveAnswer(-1);
    }

    timer.innerHTML = "<br />&#128336;" + timeLeft;
  }
}

setInterval(Timer, 1000);

function handle(e) {
  if (e.keyCode === 13) {
    e.preventDefault();

    if (!gotAnswer) {
      RecieveAnswer(answer.value);
    } else {
      NextQuestion();
    }
  }
}
