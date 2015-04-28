<?php

function ter_strlen($binary_string) {
    return function_exists('mb_strlen') ? mb_strlen($binary_string, '8bit') : strlen($binary_string);
}

$test_str = '2q3 tbckn\aw43vna9$%&/C8AW3 C97|+98R3YQW9 C8Q3RCQ3 3';
$count = 100000;

// Ter
$time_start = microtime(true);

for ($i = 0; $i < 1000; $i++) {
    ter_strlen($test_str);
}
$time_end = microtime(true);
$time = $time_end - $time_start;
echo "Ter: $time sec.\n";




