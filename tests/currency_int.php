<?php

$count = 1000000;
$sum1 = 5.6;
$sum2 = 7.8;

$time_start = microtime(true);

$sum1 *= 100;
$sum2 *= 100;

for ($i=0;$i<$count;$i++) {
    $r = $sum1/$sum2;
    $r *= 100;
    $r = (int)$r;
    $r /= 100;
}

$time_end = microtime(true);
$time = $time_end - $time_start;
echo "Int: $time sec.\n";