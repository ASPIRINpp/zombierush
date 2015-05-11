<?php

function ter_substr($binary_string, $start, $length) {
    return function_exists('mb_substr') ? mb_substr($binary_string, $start, $length, '8bit') : substr($binary_string, $start, $length);
}

$test_str = '2q3 tbckn\aw43vna9$%&/C8AW3 C97|+98R3YQW9 C8Q3RCQ3 3';
$count = 100000;

// Ter
$time_start = microtime(true);

for ($i = 0; $i < 1000; $i++) {
    ter_substr($test_str, 2, 5);
}
$time_end = microtime(true);
$time = $time_end - $time_start;
echo "Ter: $time sec.\n";




