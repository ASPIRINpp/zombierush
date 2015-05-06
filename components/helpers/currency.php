<?php defined('APP_PATH') or die('Access denied!');

/**
 * Currency methods
 *
 * @since 0.2
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'helpers:currency:_ver' => '0.2',
    'helpers:currency:normalize' => function ($sum) {
        return $sum * 100;
    },
    'helpers:currency:decimalize' => function($sum) {
        return $sum / 100;
    },
    'helpers:currency:precent' => function($sum, $precent, $round_precision = 0, $round_mode = PHP_ROUND_HALF_UP) {
        return round($sum / 100 * $precent, $round_precision, $round_mode);
    },
    'helpers:currency:dec_nformat' => function ($sum, $decimals = 0, $dec_point = '.', $thousands_sep = ',') {
        return number_format($sum / 100, $decimals, $dec_point, $thousands_sep);
    },
    'helpers:currency:dec_mformat' => function ($sum, $format = '%i') {
        return money_format($format, $sum / 100);
    }
];


