<?php
/*
COSC260 2019: Assignment 3
Author: Joshua Le Gresley (jlegresl@une.edu.au)
ID: 220197638
 */

require_once __DIR__ . '/class/Database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$responses = [
    400 => "Bad Request",
    404 => "Not Found",
    405 => "Method Not Allowed",
    500 => "Internal server error"
];

$data = array();

//POST request received
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!empty($_POST)) {
        $data['name'] = get_parameter('name');
        $data['age'] = get_parameter('age');
        $data['email'] = get_parameter('email');
        $data['phone'] = get_parameter('phone');

        foreach ($data as $key => $value) {
            // validate data
            if ($value !== false) {
                validate($key, $value);
            }
            //400: missing parameters 
            else {
                send_error(400, 'Missing parameters');
            }
        }

        //If the data passes validation:

        //create random user id
        $data['user_id'] = random_id($data['name']);


        //create database object then write JSON object to file
        $db = new Database($data);

        if ($db->writeToFile()) {
            //send response to client
            http_response_code(200);
            $json_dt = json_encode(['user_id' => $db->getUserId()]);
            echo ($json_dt);
        }
        // 500: error writing to file
        else {
            send_error(500, 'Could not save data');
        }
    }
    // 400: empty post body
    else {
        send_error(400, 'No POST data received');
    }
}
// 405: unsupported request method
else {
    send_error(405, 'Only POST requests supported');
}


/*
Utility function to send custom error responses. Function structure developed from
lecture 19 example code.
*/
function send_error($code, $message)
{
    header($_SERVER['SERVER_PROTOCOL'] . " " . $code . " - " . $GLOBALS['responses'][$code]);
    echo json_encode(['error' => $code . " - " . $GLOBALS['responses'][$code] . ": " . $message]);
    die();
}

/*
Utility function to check POST request fields exist. Returns the value of the specified parameter from the POST request. Function structure developed from lecture 19 example code.
*/
function get_parameter($param)
{
    if (isset($_POST[$param])) {
        //if the phone field exists the value will always be returned
        if ($param === 'phone') {
            return $_POST[$param];
        }
        // if these fields exist they MUST have input (ie can't be empty)
        if (!empty($_POST[$param])) {
            return $_POST[$param];
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/*
Function to valiadte data from POST request.
PARAM: name of field to validate
PARAM: value of user input from field
*/
function validate($key, $value)
{
    switch ($key) {
        case 'name':
            if (!(preg_match("/^[a-zA-Z'-]+$/", $value)) || strlen($value) < 2 || strlen($value) > 100) {
                send_error(400, 'Invalid input - ' . $key);
            }
            break;
        case "age":
            if (!(filter_var($value, FILTER_VALIDATE_INT)) || $value < 13 || $value > 130) {
                send_error(400, 'Invalid input - ' . $key);
            }
            break;
        case "email":
            if (!(filter_var($value, FILTER_VALIDATE_EMAIL))) {
                send_error(400, 'Invalid input - ' . $key);
            }
            break;
        case "phone":
            if (strlen((string) $value) !== 0) {
                if (!(preg_match("/^04[0-9]{8}$/", $value))) {
                    send_error(400, 'Invalid input - ' . $key);
                }
            }
            break;
        default:
            send_error(404, 'Invalid parameter');
    }
    return true;
}

/*
Function to generate a random user id
PARAM: value from user input field 'name'
*/
function random_id($name)
{
    $user_id = substr($name, 0, 2) . rand(10000, 99999);
    return $user_id;
}
