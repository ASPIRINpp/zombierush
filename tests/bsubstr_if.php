<?php
function if_substr($binary_string, $start, $length) {
    if (function_exists('mb_substr')) {
        return mb_substr($binary_string, $start, $length, '8bit');
    }
    return substr($binary_string, $start, $length);
}

$test_str = '2q3 tbckn\aw43vna9$%&/C8AW3 C97|+98R3YQW9 C8Q3RCQ3 3';
$count = 100000;

// If
$time_start = microtime(true);

for ($i = 0; $i < 1000; $i++) {
    if_substr($test_str, 2, 5);
}
$time_end = microtime(true);
$time = $time_end - $time_start;
echo "If : $time sec.\n";






