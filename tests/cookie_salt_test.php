<?php

// Directory with index.php
define('DOC_ROOT', realpath(dirname(__FILE__)) . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR);
require_once DOC_ROOT . 'app.php';

// Go
init('app', 'components');

// Tests
$count = 100;
$test_key = [];
$test_val = [];

// Fill test values
for ($i = 0; $i < $count; $i++) {
    $test_key[] = md5(uniqid(rand(0,100)));
    $test_val[] = md5(uniqid(rand(0,100)));
}

// If
$time_start = microtime(true);

for ($i = 0; $i < $count; $i++) {
    echo f('core:cookie:salt', $test_key[$i], $test_val[$i]), "\n";
}

$time_end = microtime(true);
$time = $time_end - $time_start;
echo "Profiling: $time sec.\n";
