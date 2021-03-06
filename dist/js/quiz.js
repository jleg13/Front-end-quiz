// jQuery onLoad
$(function () {
    initStartQuizButtonListener();
    initQuizSubmitButtonListener();
    initExitQuizButtonListener();
});

//global variables
var quizQuestionData = [];
var completed = false;
var count = 0;
//results[0 ]= attempted; results[1]= correct; results[2]= incorrect;
var results = [0, 0, 0];

// setup the button listener for the start quiz link in the side bar
function initStartQuizButtonListener() {

    $("#quizStart").click(function (e) {
        if ($('#user_message').hasClass('welcome')) {
            //hide quiz welcome
            $('#user_message').slideUp(500, function () {
                populateQuiz();
            });

        } else if ($('#user_message').hasClass('restart')) {
            $('#user_message').slideUp(500, function () {
                populateQuiz();
            });
        }
    });
}



//setup the submit event listener for the submit registration form button
function initQuizSubmitButtonListener() {
    $("#quiz").submit(function (e) {
        e.preventDefault();
        $('#quizError').addClass('invisible')

        //identify the checked answer
        var answer = $('#quiz input[name=answer]:checked').val();

        //if none checked display error
        if (answer === undefined) {
            $('#quizError').removeClass('invisible')
        } else {
            submitAnswer(answer);
        }
    });
}

//sets the listener for the exit button on the results page
function initExitQuizButtonListener() {
    $("#logOut a").click(function (e) {
        $('#user_message').slideUp(500, function () {
            $('#user_message').addClass('hidden');
            $('#logOut').addClass('hidden');
            $('#quizStart').html('Start');

            resetForm();

            $("#registration").slideDown(500, function () {
                $("#registration").removeClass("hidden");
            });
        });
    });
}

//utility function to reset form
function resetForm() {
    $('#registration').get(0).reset();
    $('.form-control').each(function () {
        $(this).removeClass('is-valid');
        $(this).next().addClass('hidden');
    });


}


//send a selected answer for checking
function submitAnswer(answer) {
    $.ajax({
        url: 'https://quizmainbackend.herokuapp.com/',
        data: {
            q: quizQuestionData[count].id,
            a: answer
        },
        method: 'POST',
        dataType: 'json',
        success: function (data) {
            updateQuizProgress(data);
            displayIcon(data);
        },
        // error function from lecture 14 code example
        error: function (jqXHR) {
            var $e = JSON.parse(jqXHR.responseText);
            console.log('Status code: ' + $e.error);
            console.log('Error message: ' + $e.message);
        }
    });
}


//update the array of current scores
function updateQuizProgress(data) {
    //update scores
    results[0]++;
    if (data.correct) {
        results[1]++;
    } else {
        results[2]++;
    }
    //tracked quiz status
    completed = (results[0] === quizQuestionData.length) ? true : false;
    //progress question number
    count++;
}


//populate quiz once user logged in and selects to start quiz
function populateQuiz() {
    $.ajax({
        url: 'https://quizmainbackend.herokuapp.com/',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            //load question data
            retrieveQuestion(data, 0);
        },
        // error function from lecture 14 code example
        error: function (jqXHR) {
            var $e = JSON.parse(jqXHR.responseText);
            console.log('Status code: ' + $e.error);
            console.log('Error message: ' + $e.message);
        }
    });
}


// Match the question ids with the corresponding question and answers
// Data is preloaded to global variable to stop the need for Ajax requests during the quiz to keep quiz responsiveness consistant between questions.
function retrieveQuestion(questionIds, i) {
    $.ajax({
        url: 'https://quizmainbackend.herokuapp.com/',
        data: {
            'q': questionIds.questions[i]
        },
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            if (i < questionIds.questions.length) {
                quizQuestionData.push(data);
                retrieveQuestion(questionIds, ++i);
            } else {
                addQuestion();
            }
        },
        // error function from lecture 14 code example
        error: function (jqXHR) {
            var $e = JSON.parse(jqXHR.responseText);
            console.log('Status code: ' + $e.error);
            console.log('Error message: ' + $e.message);
        }
    });
}


//add question to quiz
function addQuestion() {
    quizQuestionData.forEach(element => {});
    //add new question
    $('#quiz_question').html(quizQuestionData[count].text);

    //add new choices
    $('#answers label').each(function () {
        //grab the property 'value' from the sibling input field
        var value = $(this).siblings().prop('value');

        //use the 'value' to correspond to the key in the retrieved data
        $(this).html(quizQuestionData[count].choices[value]);
    });

    //add frame
    $('.form').addClass('frame')

    updateScoreText();

    //display updated quiz
    $('#quiz').slideDown(500, function () {
        $('#quiz').removeClass('hidden');
    });

    // display results
    $('#score_message').slideDown(500, function () {
        $('#score_message').removeClass('hidden');
    });
}


//update score displayed to screen
function updateScoreText() {
    var i = 0;
    $('#score_message ul li span').each(function () {
        $(this).html(results[i]);
        i++;
    });
}


//displays the final reslult once the quiz is finished
function displayResults() {
    //add final results to main content with advice
    var message = results[1] + "/" + results[0];

    var advice = function () {
        var advice;
        var score = (results[1] / results[0]) * 100;
        if (score === 100) {
            advice = 'Congratulations full marks!';
        } else if (score > 75) {
            advice = 'Great work! Well done!';
        } else if (score > 50) {
            advice = 'Good effort!';
        } else {
            advice = 'Keep practising!';
        }
        return advice;
    }

    $("#user_message h3").html(message);
    $("#user_message p").html(advice);
    $('#user_message').addClass('message_bg');
    $('#user_message').removeClass('welcome');
    $('.form').removeClass('frame')
    $('#user_message').addClass('restart');
    $('#logOut').removeClass('hidden');
    $('#quizStart').html('Restart');

    // display final message
    $('#user_message').slideDown(500, function () {
        $('#user_message').removeClass('hidden');
    });

    //reset quiz
    quizQuestionData = [];
    count = 0;
    results = [0, 0, 0];
    completed = false;
}


//display an icon if answer correct or incorrect 
function displayIcon(data) {
    //choose which icon to display
    var answer = (data.correct) ? 'borderCorrect' : 'borderIncorrect';

    //display icon
    $('#answers input:checked~label').parent().addClass(answer);

    $('#quiz').delay(1000).slideUp(500, function () {
        //remove the icon after delay
        $('#answers input:checked~label').parent().removeClass(answer);

        //reset radio buttons
        $('#answers input').prop('checked', false);
        $('#quiz').addClass('hidden');

        //move onto next question or display results
        if (completed) {
            displayResults();
        } else {
            addQuestion();
        }
    });
    //score
    $('#score_message').delay(1000).slideUp(500, function () {
        $('#score_message').addClass('hidden');
    });
}