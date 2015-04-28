<?php defined('APP_PATH') or die('Access denied!');

/**
 * Array methods
 *
 * @since 0.1
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'helpers:arr:_ver' => '0.1',
    'helpers:arr:get' => function ($key, $arr, $default = NULL) {
        return isset($arr[$key]) ? $arr[$key] : $default;
    }
];


