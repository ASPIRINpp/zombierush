<?php defined('APP_PATH') or die('Access denied!');

/**
 * String methods
 * 
 * @since 0.2
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'helpers:string:_ver' => '0.2',
    'helpers:string:b_strlen' => function ($binary_string) {
        return function_exists('mb_strlen') ? mb_strlen($binary_string, '8bit') : strlen($binary_string);
    },
    'helpers:string:b_substr' => function ($binary_string, $start, $length) {
        return function_exists('mb_substr') ? mb_substr($binary_string, $start, $length, '8bit') : substr($binary_string, $start, $length);
    },
    'helpers:string:utf8_strlen' => function ($string) {
        if (function_exists('mb_strlen')) {
            return mb_strlen($string, 'utf8');
        }
        return f('helpers:string:is_ascii', $string) ? strlen($string) : strlen(utf8_decode($string));
    },
    'helpers:string:is_ascii' => function ($string) {
        return !preg_match('/[^\x00-\x7F]/S', is_array($string) ? implode($string) : $string);
    }
];


