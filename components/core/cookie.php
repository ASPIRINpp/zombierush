<?php defined('APP_PATH') or die('Access denied!');

/**
 * Cookie component
 *
 * @since 0.1
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'core:cookie:_ver' => '0.1',
    'core:cookie:set' => function($key, $val, $expiration = 0) {
        $val = f('core:cookie:salt', $key, $val).$val;
        $expiration = $expiration !== 0 ? $expiration + time() : 0;
        return setcookie($key, $val, $expiration, '/');
    },
    'core:cookie:get' => function($key, $default = NULL) {
        if (!isset($_COOKIE[$key])) {
            return $default;
        }

        $val = $_COOKIE[$key];
        $salt = substr($val, 0, 40);
        $val = substr($val, 40);

        if ($salt !== f('core:cookie:salt', $key, $val)) {
            f('core:cookie:del', $key);
            return $default;
        }

        return $val;
    },
    'core:cookie:del' => function($key) {
        unset($_COOKIE[$key]);
        return setcookie($key, NULL, -3600, '/');
    },
    'core:cookie:salt' => function($key, $val) {
        $agent = isset($_SERVER['HTTP_USER_AGENT']) ? strtolower($_SERVER['HTTP_USER_AGENT']) : 'Software is like sex; it\'s better when it\'s free';
        return sha1(COOKIE_SALT.$agent.$key.$val);
    }
];
                