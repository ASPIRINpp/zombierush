<?php defined('APP_PATH') or die('Access denied!');

/**
 * Response component
 *
 * @since 0.1
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'core:auth:_ver' => '0.1',
    'core:response:redirect' => function($url, $code = 302, $replace = TRUE) {
        header("Location: $url", $replace, $code);
    },
    'core:response:type' => function($type, $replace = TRUE) {
        header("Content-Type: $type", $replace);
    },
];