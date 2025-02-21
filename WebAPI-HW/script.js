//Creatign a wrapper element to process all clicks on the page.
var wrapper = document.querySelector(".wrapper");
//start Button
var startBtn = null;
// variable for putting initial message with Start button and then the multiple choice questions dynamically
var initCard = document.querySelector("#init-card");
//Timer display
var timer = document.querySelector("#timerDisp");
//variable to to display result of each question as correct or wrong
var result = document.querySelector("#result");
//variable to store user entered initials
var initials = null;
//Variable to keep track of timer.  Each round get 75 seconds
var timeLeft = 75;
//Variable to keep track of number of questions
var numQues = 0;
//Variable to keep track of the score
var score = 0;
var timerInterval; // To hold the setInterval ID
//Array to store (initials, score) pair in Local storage
var scoreList = [];

//array to store all the questions, theirs choices of answers and correct answer
var questionList = [
    // {ques:"Commonly used data types do NOT include: ", btn1:"1. strings", btn2:"2. boolean", btn3:"3. alerts", btn4:"4. numbers", ans:"3. alerts"},
    {
        ques: "Commonly used data types do NOT include:",
        btn1: "strings",
        btn2: "booleans",
        btn3: "alerts",
        btn4: "numbers",
        ans: "alerts"
    },
    {
        ques: "The condition in an if/else statement is enclosed within ____.",
        btn1: "quotes",
        btn2: "curly brackets",
        btn3: "parentheses",
        btn4: "square brackets",
        ans: "parentheses"
    },
    {
        ques: "Arrays in JavaScript can be used to store ____.",
        btn1: "numbers and strings",
        btn2: "other arrays",
        btn3: "booleans",
        btn4: "all of the above",
        ans: "all of the above"
    },
    {
        ques: "String values must be enclosed within ____ when being assigned to variables.",
        btn1: "commas",
        btn2: "curly brackets",
        btn3: "quotes",
        btn4: "parentheses",
        ans: "quotes"
    },
    {
        ques: "A very useful tool used during development and debugging for printing content to the debugger is:",
        btn1: "JavaScript",
        btn2: "terminal/bash",
        btn3: "for loops",
        btn4: "console.log",
        ans: "console.log"
    }
];

//Timer function  - it is executed when Start button is pressed
function startTimer() {
    runQuiz();
    timer.textContent = "Time: " + timeLeft;
    timerInterval = setInterval(function () {
        timeLeft--;
        timer.textContent = "Time: " + timeLeft;
        if (timeLeft <= 0) {
            timeLeft = 0;
            timer.textContent = "Time: " + timeLeft;
            clearInterval(timerInterval);
            saveResults();
        }
    }, 1000);
}

//Function to run the quiz
function runQuiz() {
    if (numQues >= questionList.length) {
        saveResults();
        return;
    }
    var currentQuestion = questionList[numQues];
    initCard.innerHTML = "<h3>" + currentQuestion.ques + "</h3>" +
        "<div class='options'>" +
        "<button class='btn'>" + currentQuestion.btn1 + "</button>" +
        "<button class='btn'>" + currentQuestion.btn2 + "</button>" +
        "<button class='btn'>" + currentQuestion.btn3 + "</button>" +
        "<button class='btn'>" + currentQuestion.btn4 + "</button>" +
        "</div>";
}


// Function to save users score and initial - this is called when Timer is done or all the questions are done and timer is set to zero.
function saveResults() {
    clearInterval(timerInterval);
    initCard.innerHTML = "<h3>All done!</h3>" +
        "<p>Your final score is " + score + ".</p>" +
        "<p>Enter initials: <input id='initials' type='text' /></p>" +
        "<button class='btn'>Submit</button>";
    timer.textContent = "";
}

//Get the list of Initials and score from Local Storage to display high scores from previous runs
//if link = true, we need to create a display string for alert popup when View High Score lin is clicked
//If link = false, we need to createa string to display high score on the card in the apge.
function getScoreListString(link) {
    //get stored initial/score pair from local storage
    var storedList = JSON.parse(localStorage.getItem("scoreList")) || [];
    var values = "";
    for (var i = 0; i < storedList.length; i++) {
        var y = i + 1;
        if (!link)
            values += "<span>" + y + ". " + storedList[i].initials + " - " + storedList[i].score + "</span><br>";
        else
            values += y + ". " + storedList[i].initials + " - " + storedList[i].score + "\n";
    }
    return values;
}

//Function to calculate if the user selected correct response
function getResults(btnValue) {
    var correctAnswer = questionList[numQues].ans;
    return btnValue === correctAnswer;
}

//Function to show results list in the card on the page
function showResults() {
    initCard.innerHTML = "<b>High Scores:</b><br>" + getScoreListString(false) +
        "<button id='goBack' class='btn'>Go Back</button>" +
        "<button id='clearScores' class='btn'>Clear High Scores</button>";
    timer.textContent = "";
    result.textContent = "";
}

//main Event listener for warpper element - it will parse all the clicks for links and various buttons on the page
wrapper.addEventListener("click", function (event) {
    var element = event.target;
    var answer = false;
    event.preventDefault();

    if (element.innerHTML === "View High Scores") { //View High Scores
        console.log("View high score clicked");
        
        var newValues = getScoreListString(true);
        alert(newValues);
    } else if (element.innerHTML === "Start") {//Start Button
        console.log("Start button clicked");

        startTimer();
    } else if (element.innerHTML === "Submit") { //Submit Button

        console.log("Submit clicked");

        var initialsInput = document.querySelector("#initials");
        if (initialsInput) {
            var userScore = {
                initials: initialsInput.value.trim(),
                score: score
            };
            scoreList.push(userScore);
            localStorage.setItem("scoreList", JSON.stringify(scoreList));
            showResults();
        }
    } else if (element.innerHTML === "Go Back") {
        // Reload the page to reset the quiz.
        location.reload();
    } else if (element.innerHTML === "Clear High Scores") {
        // Clear out all saved high scores.
        scoreList = [];
        localStorage.setItem("scoreList", JSON.stringify(scoreList));
        initCard.innerHTML = "<b>High Scores:</b><br><span></span><br><button id='goBack' class='btn'>Go Back</button><button id='clearScores' class='btn'>Clear High Scores</button>";
    } else if (element.classList.contains("btn") && element.innerHTML !== "Start") {
        // Process answer button clicks
        if (numQues >= questionList.length) return;
        answer = getResults(element.innerHTML);
        if (answer === true) {
            score++;
            result.textContent = "Correct!";
        } else {
            timeLeft -= 10;
            if (timeLeft < 0) timeLeft = 0;
            timer.textContent = "Time: " + timeLeft;
            result.textContent = "Wrong!";
        }
        numQues++;
        // Clear the result message after a short delay
        setTimeout(function () {
            result.textContent = "";
        }, 1000);
        if (numQues >= questionList.length) {
            saveResults();
        } else {
            runQuiz();
        }
    }
});

//Main fucntion
//It setups up the start message
//Also initialize the scoreList for the session with any initial/scores pairs stored in local storage from previous sessions
function init() {
    initCard.innerHTML = "Click Start button to start the timed quiz. Remember a wrong answer will deduct time from the timer.<br><button id='start' class='btn'>Start</button>";
    startBtn = document.querySelector("#start");

    //get stored scores
    var storedList = JSON.parse(localStorage.getItem("scoreList"));
    if (storedList !== null) {
        scoreList = storedList;
    }
}

//Call init
init();
