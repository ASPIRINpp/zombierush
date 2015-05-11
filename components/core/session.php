<?php defined('APP_PATH') or die('Access denied!');

/**
 * Session component
 * @todo Refactoring all...
 * @since 0.1
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'core:session:_ver' => '0.1',
    'core:session:id' => function() {
        return session_id();
    },
    'core:session:open' => function ($id = NULL) {
        if (session_id()) {
            return true;
        }
        global $app;
        session_set_cookie_params($app['components']['core:session:_lifetime'], '/');
        session_cache_limiter(FALSE);
        session_name('session');

        if (!is_null($id)) {
            session_id($id);
        }

        session_start();

        /*
         * @todo progressive user activity
        $t = time();
        if (isset($_SESSION['la']) && $t-$_SESSION['la'] >= 60) {
            return f('core:session:close');
        }
        $_SESSION['la'] = $t;
        */
    },
    'core:session:regenerate' => function () {
        session_regenerate_id();
        return session_id();
    },
    'core:session:close' => function () {
        session_unset();
        session_destroy();
        $status = !session_id();
        if ($status){
            f('core:cookie:del', 'session');
        }
        return $status;
    },
    'core:session:set' => function($key, $val) {
        $_SESSION[$key] = $val;
    },
    'core:session:get' => function($key, $default = NULL) {
        return isset($_SESSION[$key]) ? $_SESSION[$key] : $default;
    },
];
                