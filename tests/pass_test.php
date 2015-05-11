<?php

// Directory with index.php
define('DOC_ROOT', realpath(dirname(__FILE__)) . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR);
require_once DOC_ROOT . 'app.php';

// Go
init('app', 'components');

// Tests
$count = 100;
$test_str = '2q3 tbckn\aw43vna9$%&/C8AW3 C97|+98R3YQW9 C8Q3RCQ3 3';

// If
$time_start = microtime(true);

for ($i = 0; $i < $count; $i++) {
    f('helpers:password:hash', $test_str);
//    f('helpers:password_2:hash', $test_str);
}

$time_end = microtime(true);
$time = $time_end - $time_start;
echo "P1 : $time sec.\n";
