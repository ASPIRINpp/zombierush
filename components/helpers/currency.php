<?php defined('APP_PATH') or die('Access denied!');

/**
 * Currency methods
 * 
 * @since 0.1
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'helpers:currency:_ver' => '0.1',
    'helpers:currency:normalize' => function ($sum) {
        return $sum * 100;
    },
    'helpers:currency:decimalize' => function($sum) {
        return $sum / 100;
    },
    'helpers:currency:format' => function ($sum, $decimals = 0, $dec_point = '.', $thousands_sep = ',') {
        return number_format($sum / 100, $decimals, $dec_point, $thousands_sep);
    }
];


