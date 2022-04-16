console.log("Hello, world! This is javascript speaking to index html!");

/* VARIABLES */
let timer = -100000000;
let questionIndex = 0;
let userScore = 0;
let timerRunning = false;
const quizBank = [{
        question: "This is a question 1",
        answers: {
            a: "anser A",
            b: "answer B",
            c: "correct ",
            d: "answer D",
        },
        correctAnswer: "c",
    },
    {
        question: "this is question 2",
        answers: {
            a: "correct",
            b: "answer B",
            c: "answer C",
            d: "answer D",
        },
        correctAnswer: "a",
    },
    {
        question: "This is question 3",
        answers: {
            a: "Answer A",
            b: "AnswerB",
            c: "AnswerD",
            d: "correct",
        },
        correctAnswer: "d",
    },
    {
        question: "This is question 4",
        answers: {
            a: "answer A",
            b: "correct ",
            c: "answerC",
            d: "answerD",
        },
        correctAnswer: "a",
    },
    {
        question: "this is question 5",
        answers: {
            a: "aaaaaaa",
            b: "b",
            c: "c",
            d: "d",
        },
        correctAnswer: "a",
    },
];
let questionQueue = [];
let currentQuestion = {};
let answerKeys = ["a", "b", "c", "d"];
let resultString = "";

const btnHighScore = document.querySelector(".btnHighscore");
btnHighScore.addEventListener("click", displayScores);
// const btnStart = document.querySelector('.btnStart');
const view = document.querySelector("#view");
const result = document.querySelector("#result");
const timeDisplay = document.querySelector("#timer");

view.addEventListener("click", function (e) {
    let element = e.target;

    if (element.matches(".btnStart")) { 
        questionQueue = [...quizBank];
        shuffle(questionQueue);
        timerRunning = true;
        startGame();
        askQuestion();
    }

    if (element.matches(".btnAnswer")) {
       
        if (currentQuestion.correctAnswer == element.dataset.key) {
            console.log("right");
            result.innerHTML = "<p class='text-success'>Correct!</p>";
        } else {
            result.innerHTML = "<p class='text-danger'>Wrong! - 5s</p>";
            timer -= 5;
        }
        questionQueue.shift();
        askQuestion();
    }

    if (element.matches(".initialSubmit")) {
        const userNameEl = document.querySelector("#initialName");
        const scoreList = JSON.parse(localStorage.getItem("scoreList")) || [];
        scoreList.push([userNameEl.value, userScore]);
        localStorage.setItem("scoreList", JSON.stringify(scoreList));
        userScore = 0;
        displayScores();
    }

    if (element.matches(".btnRestart")) {
        displayInitView();
    }
    if (element.matches(".btnClearBoard")) {
        localStorage.setItem("scoreList", JSON.stringify([]));
        displayScores();
    }
});

function displayScores() {
    timer = 0;
    userScore = 0;
    currentQuestion = {};
    questionQueue = [];
    let htmlTemplate = `<h2>ScoreBoard</h2>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Initials</th>
                    <th scope="col">Score</th>
                </tr>
            </thead>
            <tbody>
    `;
    const scoreList = JSON.parse(localStorage.getItem("scoreList")) || [];
    scoreList.sort(function (a, b) {
        return b[1] - a[1];
    });
    for (let player of scoreList) {
        htmlTemplate += `
            <tr>
                <th scope="row"> ${scoreList.indexOf(player) + 1} </th>
                <th>${player[0]}</th>
                <th>${player[1]}</th>
            </tr>
        `;
    }
    htmlTemplate += `</tbody></table>
        <button class='btn btn-primary btnRestart'> Back </button>
        <button class='btn btn-outline-danger btnClearBoard'> Reset ScoreBoard</button>
    `;
    view.innerHTML = htmlTemplate;
}

function askQuestion() {
    if (questionQueue.length >= 1) {
        currentQuestion = questionQueue[0];
        shuffle(answerKeys);
        let htmlTemplate = `<h5>${currentQuestion.question}</h5>
        <div class='text-start'>
        `;
        for (let i = 0; i < answerKeys.length; i++) {
            htmlTemplate += `
            <button class="btn btn-outline-secondary my-2 btnAnswer" data-key="${
              answerKeys[i]
            }">
                ${currentQuestion.answers[answerKeys[i]]}
            </button> <br/>
            `;
        }
        htmlTemplate += `</div>`;
        view.innerHTML = htmlTemplate;
    } else {
        timerRunning = false;
        gameOver();
    }
}

function gameOver() {
    userScore = timer;
    timeDisplay.style.display = "none";
    result.textContent = "";
    let htmlTemplate = `
        <h3>All done!</h3>
        <p>Your final score: <span class="h4 ${userScore>0?'text-success':'text-danger'}">${userScore}</span></p>
        <label for="initialName" class="form-label">Enter Your Initials:</label>
        <input type="text" id="initialName" class="form-control" aria-describedby="user initials"/>
        <button class="btn btn-primary initialSubmit">Submit</button>
    `;
    view.innerHTML = htmlTemplate;
}

function shuffle(anArray) {
    for (let i = anArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [anArray[i], anArray[j]] = [anArray[j], anArray[i]];
    }
}

function startGame() {
    timer = 55;
    timeDisplay.textContent = `${timer} s left`;
    timeDisplay.style.display = "block";
    let everySecond = setInterval(() => {
        if (timer > 0 && timerRunning == true) {
            timer--;
            timeDisplay.textContent = `${timer} s left`;
        } else {
            gameOver();
            clearInterval(everySecond);
            timeDisplay.textContent = `${timer} pt`;
        }
    }, 1000);
}

function displayInitView() {
    view.innerHTML = `
    <h5 class="card-title">Click the button to play</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <button class="btn btn-primary btnStart">Start</button>
    `;
    timeDisplay.style.display = "none";
}

displayInitView();