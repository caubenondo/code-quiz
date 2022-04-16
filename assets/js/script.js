console.log("Hello, world! This is javascript speaking to index html!");

/* MODELS - VARIABLES */
let timer = -100000000;
let questionIndex = 0;
let userScore = 0;
let timerRunning = false;
const quizBank = [{
    "question": "let anArray = [1,2,3,5,4].\n what is anArray[4]?",
    "answers": {
        "a": "'4'",
        "b": "'5'",
        "c": "4",
        "d": "5"
    },
    "correctAnswer": "c"
}, {
    "question": "let anArray = [[1,2],[3,4]]. \nHow do we target index that has value 3",
    "answers": {
        "a": "anArray[0][1]",
        "b": "anArray[1,0]",
        "c": "anArray[0][0]",
        "d": "anArray[1][0]"
    },
    "correctAnswer": "d"
}, {
    "question": "let myObj = {'a':1,'b':'c','c':'b',d:this['c']} \nwhat is return value of myObj.d",
    "answers": {
        "a": "undefined",
        "b": "'b'",
        "c": "'c'",
        "d": "'bc'"
    },
    "correctAnswer": "a"
}, {
    "question": "let myObj = {'a':1,'b':'c','c':'b',d:self['c']}\nwhat is value of myObj.c?",
    "answers": {
        "a": "'c'",
        "b": "'b'",
        "c": "c",
        "d": "b"
    },
    "correctAnswer": "b"
}, {
    "question": "let anArray = [{a:'b',c:'d'},{d:'c',b:'a'}]\n What is the return of anArray[1].a",
    "answers": {
        "a": "undefined",
        "b": "null",
        "c": "syntax error",
        "d": "'b'"
    },
    "correctAnswer": "a"
}];
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


// CONTROLLER
// listen to all the buttons in .view
view.addEventListener("click", function (e) {
    let element = e.target;
    // if start btn is click,
    // copy the content of quizBank to question queue array to shuffle the questions 
    //then start the counter, ask quesitons
    if (element.matches(".btnStart")) {
        questionQueue = [...quizBank];
        shuffle(questionQueue);
        timerRunning = true;
        startGame();
        askQuestion();
    }
    // when user click answer btn, validate the answer; if it's wrong, -5s 
    // remove the first in queue out of question queue then ask question
    if (element.matches(".btnAnswer")) {
        if (currentQuestion.correctAnswer == element.dataset.key) {
            result.innerHTML = "<p class='text-success'>Correct!</p>";
        } else {
            result.innerHTML = "<p class='text-danger'>Wrong! - 5s</p>";
            timer -= 5;
        }
        questionQueue.shift();
        askQuestion();
    }
    // when submit initial btn click
    // get user's initials input
    // store user initials and current score to the local storage
    // then display the score list
    if (element.matches(".initialSubmit")) {
        const userNameEl = document.querySelector("#initialName");
        const scoreList = JSON.parse(localStorage.getItem("scoreList")) || [];
        scoreList.push([userNameEl.value, userScore]);
        localStorage.setItem("scoreList", JSON.stringify(scoreList));
        userScore = 0;
        displayScores();
    }

    // when user click GoBack; reset all global values and display welcome view
    if (element.matches(".btnRestart")) {
        timer = 0;
        userScore = 0;
        currentQuestion = {};
        questionQueue = [];
        displayInitView();
    }
    // when user click reset score button,
    // assign the empty array to the local storage
    // display the empty scores board on .view 
    if (element.matches(".btnClearBoard")) {
        localStorage.setItem("scoreList", JSON.stringify([]));
        displayScores();
    }
});

/* VIEWS display/handle functions */
function displayScores() {
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
                <th class="${player[1]>0? 'text-success':'text-danger'}">${player[1]}</th>
            </tr>
        `;
    }
    htmlTemplate += `</tbody></table>
        <button class='btn btn-primary btnRestart'> Back </button>
        <button class='btn btn-outline-danger btnClearBoard'> Reset ScoreBoard</button>
    `;
    view.innerHTML = htmlTemplate;
}

// initialize the initial view that has start button
function displayInitView() {
    view.innerHTML = `
    <div class="text-center">
    <h5 class="card-title">Click the button to play</h5>
    <p class="card-text">You will have 30s to answer 5 coding questions.<br/> Every time you pick wrong answer, you will lose 5s.</p>
    <button class="btn btn-primary btnStart">Start</button>
    </div>
    `;
    timeDisplay.style.display = "none";
}

// Game Over display on .view
// display the user score and prompt user putting their initials
function gameOver() {
    userScore = timer;
    timeDisplay.style.display = "none";
    result.textContent = "";
    let htmlTemplate = `
        <h3>All done!</h3>
        <p>Your final score: <span class="h4 ${userScore>0?'text-success':'text-danger'}">${userScore}</span></p>
        <label for="initialName" class="form-label">Enter Your Initials:</label>
        <input type="text" id="initialName" class="form-control" aria-describedby="user initials"/>
        <button class="btn btn-primary initialSubmit mt-3">Submit</button>
    `;
    view.innerHTML = htmlTemplate;
}

// utility function
// shuffle order of values in an array by swapping their index
function shuffle(anArray) {
    for (let i = anArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [anArray[i], anArray[j]] = [anArray[j], anArray[i]];
    }
}
// check if question queue has question
// shuffle answers
// display the question and its anwswers to .view
// if question queue has no question --> gane over
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
// start the counter/timer and keep track of it to decide if the game is over
function startGame() {
    timer =30;
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




displayInitView();