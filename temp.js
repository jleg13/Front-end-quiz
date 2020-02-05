
//displays the final reslult once the quiz is finished
function displayResults() {
    //add final results to main content with advice
    var results = results[1] + "/" + results[0];

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

     $("#user_message h3").html(result);
     $("#welcome p").html(advice);
     $('#logout').removeClass(hidden);
     $('#quizStart').html('Try Again')

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
    var answerImg = (data.correct) ? 'correctImg' : 'incorrectImg';

    var answerBd = (data.correct) ? 'correctBorder' : 'incorrectBorder';

    //display icon
    $('#answers input').addClass('invisible');
    $('#answers input').addClass('absolute');
    $('#answers form-group').addClass('align');
    $('#answers form-group').addClass(answerBd);
    $('#answers input:checked~label').addClass(answerImg);

    $('#quiz').delay(1000).slideUp(500, function () {
        //remove the icon after delay
        $('#answers input').removeClass('invisible');
        $('#answers input').removeClass('absolute');
        $('#answers form-group').removeClass('align');
        $('#answers form-group').removeClass(answerBd);
        $('#answers input:checked~label').removeClass(answer);

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
    //side results accumulator
    $('#score_message').delay(1000).slideUp(500, function () {
        $('#score_message').addClass('hidden');
    });
}