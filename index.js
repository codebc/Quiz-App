/* this tells the browser to load this (collection of) functions */ 

$(createQuiz);

/* this does 4 things: 1) it sets an event listener for when someone clicks the start butotn; 2) it renders the question page to the screen (but keeps it hidden); 3) it sets an event listener to display the Feedback page when the user clicks the submit button; and 4) it sets an event listener for when someone presses the next button */
function createQuiz () {
  handleStartQuiz();
  renderQuestion();
  handleUserFeedback();
  handleNextQuestion();
}

/* before we start we set our feedback counters to 0 */

let questionNumber = 0;
let score = 0;


/* we create an event listener which 'watches' the class .quizStart, and when someone clicks on the startbutton, it sets in motion the following functions: it removes the .quizStart section from the page (this is the Starting Page Text and Button); then we 'show' the questionAnswerForm which was originally set to display:none so it would be hidden at the start. (the example used .css('display', 'block'); which Maxim F. says does the same as '.show.' in this case); lastly we set .questionNumber to '1' using .text method  */
function handleStartQuiz () {
  $('.quizStart').on('click', '.startButton', function (event) {
    $('.quizStart').remove();
    $('.questionAnswerForm').show();
    $('.questionNumber').text(1);
});
}

/* now we want the question/answers to appear on the screen, so we render them by using html method to set the content of questionAnswerForm by running the function generateQuestion (which contains all the html of our question/answer pages along with the references to our stored questions and answers) */

function renderQuestion () {
  $('.questionAnswerForm').html(generateQuestion());
}

/* here's the function we called in renderQuestion to display the actual question on the screen. renderQuestion above inserts the following html into the div class questionAnswerForm. fieldset/legend is a holdover from an early version. it's not serving an A11Y purpose here, but it worked out well visually and I didn't have time to change it before submitting */

function generateQuestion () {
  if (questionNumber < STORE.length) {
    return `<div class="question-${questionNumber}">
    <h1 class="answer-page-questions">${STORE[questionNumber].question}</h1>
    <form>
    <fieldset>
    <legend><span class="sr-only">Possible Answers</span></legend>
    <label class="answerOption">
    <input type="radio" value="${STORE[questionNumber].answers[0]}" name="answer" required>
    <span>${STORE[questionNumber].answers[0]}</span>
    </label>
    <label class="answerOption">
    <input type="radio" value="${STORE[questionNumber].answers[1]}" name="answer" required>
    <span>${STORE[questionNumber].answers[1]}</span>
    </label>
    <label class="answerOption">
    <input type="radio" value="${STORE[questionNumber].answers[2]}" name="answer" required>
    <span>${STORE[questionNumber].answers[2]}</span>
    </label>
    <label class="answerOption">
    <input type="radio" value="${STORE[questionNumber].answers[3]}" name="answer" required>
    <span>${STORE[questionNumber].answers[3]}</span>
    </label>
    <button type="submit" class="submitButton">Submit</button>
    </fieldset>
    </form>
    </div>`;
} else {
    renderResults();
    rehandleStartQuiz();
    $('.questionNumber').text(10)
  }
}

/* set an event listener so that when someone clicks on 'submit' the chosen answer ('input:checked') is compared to the correct answer and the appropriate follow-up is called */

function handleUserFeedback () {
  $('form').on('submit', function (event) {
    event.preventDefault();
    let selected = $('input:checked');
    let answer = selected.val();
    let correctAnswer = `${STORE[questionNumber].correctAnswer}`;
    if (answer === correctAnswer) {
      selected.parent().addClass('correct');
      ifAnswerIsCorrect();
    } else {
      selected.parent().addClass('wrong');
      ifAnswerIsWrong();
    }
  });
}

function ifAnswerIsCorrect () {
  userAnswerFeedbackCorrect();
  updateScore();
}

function ifAnswerIsWrong () {
  userAnswerFeedbackWrong();
}

/* when the user submits an answer, we need to update their score, so we create an updateScore function that has the changeScore function inside it, in case the user answered correctly. updateScore is only called if the user answers correctly. otherwise it is not called, and the score doesn't change */

function updateScore () {
  changeScore();
  $('.score').text(score);
}

/* if the user answers correctly, we need to increase the score by one. we create that function here and call it in the updateScore function */

function changeScore () {
  score ++;
}

/* if the user answers correctly, we render the correct answer feedback from our dataSTORE */
function userAnswerFeedbackCorrect () {
  let correctAnswer = `${STORE[questionNumber].correctAnswer}`;
  $('.questionAnswerForm').html(`<div class="correctFeedback"><div class="icon"><img src="${STORE[questionNumber].icon}" alt="${STORE[questionNumber].alt}"/></div><p><b>Yes, that's right!</b></p><button type=button class="nextButton">Next</button></div>`);
}

/* user feedback for wrong answer */
function userAnswerFeedbackWrong () {
  let correctAnswer = `${STORE[questionNumber].correctAnswer}`;
  // let iconImage = `${STORE[questionNumber].icon}`;
  $('.questionAnswerForm').html(`<div class="correctFeedback"><div class="icon"><img src="${STORE[questionNumber].icon}" alt="${STORE[questionNumber].alt}"/></div><p><b>Nyet! That is wrong!</b><br>The correct answer is <span>"${correctAnswer}"</span></p><button type=button class="nextButton">Next</button></div>`);
}

/* from the feedback page, a button to continue to the next question */

function handleNextQuestion () {
  $('main').on('click', '.nextButton', function (event) {
    changeQuestionNumber();
    renderQuestion();
    handleUserFeedback();
  });
}

/* as we go, we need to increment the question number */

function changeQuestionNumber () {
  //if (questionNumber < STORE.length) {
    questionNumber ++;
  //}
  $('.questionNumber').text(questionNumber+1);
}

/* when the user has answered 10 questions, the else statement in generateQuestion is triggered and renderResults is called. depending on the users score, one of three responses will be loaded. play around with adding additional information about the correct choices in this location, e.g. The correct answer is Pushkin. His grandfather came to Russia from Central Africa, befriended Peter the Great and was awarded status as Russian nobility, fathering x number of children */

function renderResults () {
  if (score >= 8) {
    $('.questionAnswerForm').html(`<div class="results correctFeedback"><h3>Wow! You <it>really</it> know Russian writers!</h3><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHZFPrppbf0i6qELdfGmfYOOsspq5NDlN83uaefqHiRpEiYqv_" alt="happy Russian babushka"/><p>You got ${score} / 10</p><p>You could teach a class on this stuff!</p><button class="restartButton">Restart Quiz</button></div>`);
  } else if (score < 8 && score >= 5) {
    $('.questionAnswerForm').html(`<div class="results correctFeedback"><h3>Ok, so you know a little...but there's so much more to know!</h3><img src="https://rian.com.ua/images/102036/96/1020369669.jpg" alt="books by Russian authors"/><p>You got ${score} / 10</p><p>Go read a book right now!</p><button class="restartButton">Restart Quiz</button></div>`);
  } else {
    $('.questionAnswerForm').html(`<div class="results correctFeedback"><h3>This Russian babushka is sad that you know nothing about Russian writers.</h3><img src="https://99px.ru/sstorage/56/2013/01/mid_80961_9813.jpg" alt="Russian babushka sticking out her tongue"/><p>You got ${score} / 10</p><p>Go read a book right now!</p><button class="restartButton">Restart Quiz</button></div>`);
  }
}

/* button to restart the quiz */
function rehandleStartQuiz () {
  $('main').on('click', '.restartButton', function (event) {
    location.reload();
  });
}