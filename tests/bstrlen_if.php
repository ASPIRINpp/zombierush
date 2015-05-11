<?php
function if_strlen($binary_string) {
    if (function_exists('mb_strlen')) {
        return mb_strlen($binary_string, '8bit');
    }
    return strlen($binary_string);
}

$test_str = '2q3 tbckn\aw43vna9$%&/C8AW3 C97|+98R3YQW9 C8Q3RCQ3 3';
$count = 100000;

// If
$time_start = microtime(true);

for ($i = 0; $i < 1000; $i++) {
    if_strlen($test_str);
}
$time_end = microtime(true);
$time = $time_end - $time_start;
echo "If : $time sec.\n";






