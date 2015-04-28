<?php defined('APP_PATH') or die('Access denied!');

/**
 * i18n methods
 *
 * @since 0.1
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'core:i18n:_ver' => '0.1',
    'core:i18n:_messages' => [],
    'core:i18n:load_messages' => function ($lang) {
        global $app;
        $path = APP_PATH . 'lang' . DIRECTORY_SEPARATOR . $lang . '.php';
        if (file_exists($path)) {
            $app['components']['core:i18n:_messages'] = include $path;
        }
    },
    'core:i18n:get' => function ($text) {
        global $app;
        return isset($app['components']['core:i18n:_messages'][$text]) ? $app['components']['core:i18n:_messages'][$text] : $text;
    },
    'core:i18n:t' => function ($text) {
        return __($text);
    },
];