let $question;
let $form;
let $submit;

let $total_questions = $questions.length;
let $scoring = {correct: 0, incorrect: 0, attempts: 0};
let $counted_incorrect = false;

$(()=>{
$form = $('#quiz');
$submit = $("#sub");

$('#quiz').removeClass('hidden');
$("#score").removeClass('hidden');

//prevent default on submit and reset
$submit.click( e => e.preventDefault());

// check answer on submit
$submit.click(()=> {
    let $ans = $('input[name=answer]:checked').val();
    
    try {
        checkAnswer();
    } 
    catch (e) {
        if (e.name == 'TypeError') {
            endQuiz();
        }
    }
    
});
$question = $questions.splice(Math.floor(Math.random()*$questions.length), 1)[0];
getQuestion();
});

function getQuestion(){

    if($questions.length < 0){
        endQuiz();
    }
    displayScoring();
    displayQuestions();
}

function displayQuestions(){
    // Stores the question.
    var question = $question.question;
    
    // Answers for the question, stored in a dictionary so answers can be displayed using a loop.
    var answers = { a: $question.a,
                    b: $question.b,
                    c: $question.c,
                    d: $question.d };
    
    // Clears radio buttons in preparation for answer selection.
    $('input[type="radio"]').prop('checked', false); 
    
    // Displays the question.
    $("#quiz_question").html(question);
    
    // Iterates over the answer choices and displays them.
    for (var answer in answers) {
        $(`label[for='answer_${answer}']`).html(answers[answer]);
        
        // If 'NA' is the answer, don't display that option. Benefits a handful of True/False questions.
        if (answers[answer] == "NA" || answers[answer] == null) {
            $(`#fieldset_${answer}`).hide();
        }
        else {
            $(`#fieldset_${answer}`).show();
        }
    }
}

function checkAnswer(){
    let $answer = $('input[type="radio"]:checked').val();

    if($answer !== "undefined"){
        if ($answer === $question.answer) { 
            $scoring.attempts++;
            
            if (!$counted_incorrect) {
                $scoring.correct++;
            }
            
            $counted_incorrect = false;
            displayScoring();
            
            for (var i = 0; i <= 4; i++) {
                 $(`#fieldset_${"abcd".charAt(i)}`).css('background-color', '#F5F5F5');
            }
            
            $question = $questions.splice(Math.floor(Math.random()*$questions.length), 1)[0];
            getQuestion();
        }
        else {
            if (!$counted_incorrect) {
                $scoring.incorrect++;
                $counted_incorrect = true;
            }
            
            $(`#fieldset_${$answer}`).css('background-color', '#FF6060');
            displayScoring();
            displayQuestions();
        }
    }
}

function displayScoring() {
    // Displays current question number. Accounts for 0-index.
    if ($questions.length > 0) {
        $('#attempted').html(`Question ${$scoring.attempts + 1} of ${$total_questions}`);
    }
    else {
        $('#attempted').html(`Question ${$scoring.attempts} of ${$total_questions}`);
    }
    
    // Displays current scoring.
    $('#correct').html(`Correct: ${$scoring.correct}`);
    $('#incorrect').html(`Incorrect: ${$scoring.incorrect}`);
}

function endQuiz(){
    const $form = $('#quiz');
    const $submit = $("input[type=submit]",$form);
    const $radio = $("input[type=radio]",$form);
    $submit.attr("disabled", "disabled");
    $radio.attr("disabled", "disabled");
    
    var score = ((($scoring.correct - $scoring.incorrect) / $total_questions) * 100).toFixed(2);
    $('#answers').append("<hr /><p class='centered'>Quiz finished! Please refresh to play again!</p>");
    $('#answers').append(`<p class='centered'>Final score: ${score}%</p>`);
}