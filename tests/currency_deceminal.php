<?php
$count = 1000000;
$sum1 = 5.6;
$sum2 = 7.8;

$time_start = microtime(true);
for ($i=0;$i<$count;$i++) {
    $r = bcdiv($sum1,$sum2,2);
}
$time_end = microtime(true);
$time = $time_end - $time_start;
echo "Deceminal: $time sec.\n";
