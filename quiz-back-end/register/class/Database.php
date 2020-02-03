<?php
/*
Database class stores user inputed data and unique user ID.
Allows data to be written to file.
*/
class Database implements JsonSerializable
{
  private $name;
  private $age;
  private $email;
  private $phone;
  private $user_id;


  function __construct($data)
  {
    $this->name = $data['name'];
    $this->age = $data['age'];
    $this->email = $data['email'];
    $this->phone = $data['phone'];
    $this->user_id = $data['user_id'];
  }


  public function getName()
  {
    return $this->name;
  }

  public function getAge()
  {
    return $this->age;
  }

  public function getEmail()
  {
    return $this->email;
  }

  public function getPhone()
  {
    return $this->phone;
  }

  public function getUserId()
  {
    return $this->user_id;
  }

  public function jsonSerialize()
  {
    return [
      'name' => $this->name,
      'age' => $this->age,
      'email' => $this->email,
      'phone' => $this->phone,
      'user_id' => $this->user_id
    ];
  }

  /*
  Function to write this objects fields to database.txt file.
  Data is sent as a JSON object using the jsonSerialize function.
  */
  public function writeToFile()
  {
    return (file_put_contents('database.txt', json_encode(self::jsonSerialize()), FILE_APPEND) !== false) ? true : false;
  }
}
