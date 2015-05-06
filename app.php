<?php defined('DOC_ROOT') or die('Access denied!');

/**
 * This is you awesome app!
 */
$app = [];

/**
 * Init you app
 * @global array $app Link to you app
 * @param string $app_dir Application directory
 * @param string $components_dir Components directory
 */
function init($app_dir, $components_dir) {
    global $app;

    if (!is_dir($components_dir) AND is_dir(DOC_ROOT . $components_dir)) {
        $components_dir = DOC_ROOT . $components_dir;
    }

    if (!is_dir($app_dir) AND is_dir(DOC_ROOT . $app_dir)) {
        $app_dir = DOC_ROOT . $app_dir;
    }

    // Define path consts (APP_PATH used for check direct script access)
    define('APP_PATH', realpath($app_dir) . DIRECTORY_SEPARATOR);
    define('COM_PATH', realpath($components_dir) . DIRECTORY_SEPARATOR);

    /**
     * Build app structure
     */
    $app = [
        'components' => [],
        'controller' => [],
        'models' => [],
        'config' => include APP_PATH . 'config' . DIRECTORY_SEPARATOR . 'app.php',
    ];

    // Define session enables, cookie salt
    // @todo It's fast, but...
    define('SESSION_ENABLE', isset($app['config']['components']['core:session']['enable']) ? $app['config']['components']['core:session']['enable'] : FALSE);
    define('COOKIE_SALT_ENABLE', isset($app['config']['components']['core:cookie']['enable_salt']) ? $app['config']['components']['core:cookie']['enable_salt'] : FALSE);

    // Define cookie salt
    // WARNING: change this value in config file
    if (COOKIE_SALT_ENABLE) {
        define('COOKIE_SALT', $app['config']['components']['core:cookie']['salt']);
    }

    /**
     * Check needed i18n
     */
    if (isset($app['config']['lang'])) {
        f('core:i18n:load_messages', $app['config']['lang']);
        if (!function_exists('__')) {

            function __($str, array $values = NULL, $lang = 'en-us') {
                $str = $lang !== gc('lang') ? f('core:i18n:get', $str) : $str;
                return empty($values) ? $str : strtr($str, $values);
            }

        }
    }
    /**
     * Set locale
     */
    if (isset($app['config']['locale'])) {
        setlocale(LC_ALL, $app['config']['locale']);
    }
}

/**
 * @param $name
 * @param string $to
 * @todo refactoring this function
 */
function _loader($name, $to = 'vendor') {
    global $app;
    switch ($to) {
        case 'components':
            $path = COM_PATH;
            break;
        case 'controller':
            $path = APP_PATH . 'controllers' . DIRECTORY_SEPARATOR;
            break;
        case 'models':
            $arr = explode(':', $name);
            $app[$to] = array_merge($app[$to], include APP_PATH . 'models' . DIRECTORY_SEPARATOR . $arr[0] . '.php');
            return;
        default:
            // Vendor
            $path = APP_PATH . 'vendors' . DIRECTORY_SEPARATOR;
            break;
    }

    $app[$to] = array_merge($app[$to], include $path . str_replace(':', DIRECTORY_SEPARATOR, $name) . '.php');
}

/**
 * @param $f
 * @param $from
 * @return mixed
 * @todo refactoring this function
 */
function _getter($f, $from) {
    global $app;
    if (!isset($app[$from][$f])) {
        $arr = explode(':', $f);
        if (count($arr) > 1) {
            _loader("{$arr[0]}:{$arr[1]}", $from);
        }
    }
    return $app[$from][$f];
}

/**
 * @param $f
 * @param $from
 * @param $args
 * @return mixed
 * @todo refactoring this function
 */
function _caller($f, $from, $args) {
    $func = _getter($f, $from);
    if (!is_callable($func)) {
        trigger_error("The function $from:$f(" . implode(', ', $args) . ") is not callable!", E_USER_ERROR);
    }
    return call_user_func_array($func, $args);
}

/**
 * Load component
 * @global array $app
 * @param string $name Component name
 */
function lc($name) {
    _loader($name, 'components');
}

/**
 * Get config value by key
 * @param string $key Key
 * @param mixed $default Default value
 * @return mixed Value
 */
function gc($key, $default = NULL) {
    global $app;
    return isset($app['config'][$key]) ? $app['config'][$key] : $default;
}

/**
 * Get any function from any component
 * @global array $app
 * @param string $f
 * @return array
 */
function gf($f) {
    return _getter($f, 'components');
}

/**
 * Call any function from any component
 * @param string $f Group:Component:Function name
 * @param mixed $_ [optional]  Variable list of arguments to callable function
 * @example f('helpers:test:say_hi', 'Bill');
 * @todo refactoring this function
 */
function f($f) {
    $args = [];
    if (func_num_args() > 1) {
        $args = func_get_args();
        unset($args[0]);
    }
    return _caller($f, 'components', $args);
}

/**
 * @param $f
 * @return mixed
 * @todo refactoring this function
 */
function m($f) {
    $args = [];
    if (func_num_args() > 1) {
        $args = func_get_args();
        unset($args[0]);
    }
    return _caller($f, 'models', $args);
}

/**
 * Finish request, only for FastCGI
 */
function finish() {
    if (PHP_SAPI != 'fpm-fcgi') {
        return FALSE;
    }
    if (SESSION_ENABLE) {
        session_write_close();
    }
    fastcgi_finish_request();
}