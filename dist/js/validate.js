// regular expressions for age validation (line 70) sourced from: www.http://regexlib.com
// All other regular expressions sourced from assignment2-criteria.pdf and Tutorial4-week5.pdf

// jQuery onLoad
$(function () {
  initRegistrationSubmitButtonListener();
});

//anonymous function to return a jQury object
var $element = function (tag, id_, cl, content) {
  return $(tag, {
    id: id_,
    class: cl,
    html: content
  });
};

//setup the submit event listener for the submit registration form button
function initRegistrationSubmitButtonListener() {
  $("#registration").submit(function (e) {
    e.preventDefault();
    clearValidation();

    if (validate()) {
      submitRegistrationForm();
    }
    return false;
  });
}

//submit validated form to the server
function submitRegistrationForm() {
  $.ajax({
    url: "https://jleg13.educationhost.cloud",
    method: "POST",
    data: $("#registration").serialize(),
    dataType: "json",
    success: function (data) {
      displayQuizMain(data);
    },
    // error function from lecture 14 code example
    error: function (jqXHR) {
      var $error = JSON.parse(jqXHR.responseText);
      console.log("Status code: " + $error.error);
      console.log("Error message: " + $error.message);
    }
  });
}

//validate the user input before sending to the server
function validate() {
  //keep track of validity
  var success = true;

  //variable for all user input fields
  var $form = $("#registration [type=text]");

  //initially validate length of mandatory fields (ie, excluding optional phone input)
  $form.each(function () {
    if ($(this).is("#name")) {
      var $name = $(this).val();
      //name validation for length
      if ($(this).val().length === 0) {
        addValidation(".invalid-name", "#name", false);
        success = false;
      } else if ($name.length < 2 || $name.length > 100) {
        addValidation(".invalid-name", "#name", false);
        success = false;
      }
      //name validation for specified characters
      else if (!/^[a-zA-Z'-]+$/.test($name)) {
        addValidation(".invalid-name", "#name", false);
        success = false;
      } else {
        addValidation(".valid-name", "#name", true);
      }
    } else if ($(this).is("#age")) {
      var $age = $("#registration #age").val();
      //age validation for integer value
      if ($(this).val().length === 0) {
        addValidation(".invalid-age", "#age", false);
        success = false;
      } else if (!/^[-+]?\d*$/.test($age)) {
        addValidation(".invalid-age", "#age", false);
        success = false;
      }
      //age validation for correct age range
      else if ($age < 13 || $age > 130) {
        addValidation(".invalid-age", "#age", false);
        success = false;
      } else {
        addValidation(".valid-age", "#age", true);
      }
    } else if ($(this).is("#email")) {
      var $email = $("#registration #email").val();
      //email validation
      if ($(this).val().length === 0) {
        addValidation(".invalid-email", "#email", false);
        success = false;
      } else if (!/^[a-zA-Z-]([\w-.]+)?@([\w-]+\.)+[\w]+$/.test($email)) {
        addValidation(".invalid-email", "#email", false);
        success = false;
      } else {
        addValidation(".valid-email", "#email", true);
      }
    } else if ($(this).is("#phone")) {
      var $phone = $("#registration #phone").val();
      //phone validation field contains (optional) input
      if ($phone.length > 0) {
        //phone validation length is 10 digits
        if ($phone.length !== 10) {
          addValidation(".invalid-phone", "#phone", false);
          success = false;
        }

        //phone validation contains only digits
        else if (!/^[0-9]+$/.test($phone)) {
          addValidation(".invalid-phone", "#phone", false);
          success = false;
        }

        //phone validation number starts with digits 04
        else if (!/^04/.test($phone)) {
          addValidation(".invalid-phone", "#phone", false);
          success = false;
        } else {
          addValidation(".valid-phone", "#phone", true);
        }
      }
    }
  });
  return success;
}

// Clear all error messages from the #user_message element
function clearValidation() {
  let $messages = $(".label");

  $messages.each(function () {
    $(this).addClass("hidden");
  });
}

// Add an error message to the #errors element
function addValidation(id1, id2, status) {
  $(id1).removeClass("hidden");
  if (status) {
    $(id2).addClass("is-valid");
  } else {
    $(id2).addClass("is-invalid");
  }
}

//function to display the quiz main page
function displayQuizMain(data) {
  //hide registration form then display quiz
  $("#registration").slideUp(500, function () {
    $("#registration").addClass("hidden");

    //create id messege
    greeting = "Welcome User: " + data.user_id;
    $("#user_message h3").html(greeting);

    message = "Good luck in this computer science quiz!";
    $("#user_message p").html(message);

    $("#user_message").slideDown(500, function () {
      $("#user_message").removeClass("hidden");
      $("#user_message").addClass("welcome");
    });
  });
}