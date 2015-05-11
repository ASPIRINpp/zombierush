<?php

define('DOC_ROOT', realpath(dirname(__FILE__)) . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR);
require_once DOC_ROOT . 'app.php';
init('app', 'components');

// Tests //
$count = 10;

$sql = 'INSERT'
        . ' INTO sys_users (email, `password`, surname, `name`, middlename, sex, date_reg, deleted)'
        . ' VALUES (:email, :password, :surname, :name, :middlename, :sex, :date_reg, :deleted);';

$time_start = microtime(true);

for ($i = 0; $i < $count; $i++) {
    $r = f('db:mysql:q_insert', $sql, [
        ':email' => uniqid('Tester_') . '@example.com',
        ':password' => f('helpers:password:hash', '123123'),
        ':surname' => NULL,
        ':name' => uniqid('Tester_'),
        ':middlename' => NULL,
        ':sex' => rand(0, 1),
        ':date_reg' => time(),
        ':deleted' => FALSE
    ]);
}

$time_end = microtime(true);
$time = $time_end - $time_start;
echo "Created $i users on $time sec.\n";
