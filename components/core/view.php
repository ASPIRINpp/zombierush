<?php defined('APP_PATH') or die('Access denied!');

/**
 * View component
 *
 * @since 0.2
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'core:view:_ver' => '0.2',
    'core:view:_layout' => APP_PATH . 'views' . DIRECTORY_SEPARATOR . 'layout.php',
    'core:view:_globals' => [],
    'core:view:_content' => '',
    'core:view:la' => function ($n) {
        return f('core:view:layout', $n);
    },
    'core:view:r' => function ($v = NULL, $p = NULL) {
        return f('core:view:render', $v, $p);
    },
    'core:view:c' => function ($v, $p = NULL) {
        return f('core:view:compile', $v, $p);
    },
    'core:view:p' => function ($v, $p = NULL, $r = FALSE) {
        return f('core:view:print', $v, $p, $r);
    },
    'core:view:layout' => function ($name) {
        global $app;
        $app['components']['core:view:_layout'] = APP_PATH . 'views' . DIRECTORY_SEPARATOR . $name . '.php';
    },
    'core:view:get_view_path' => function ($view) {
        return APP_PATH . 'views' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $view). '.php';
    },
    'core:view:render_file' => function ($file, $params = []) {
        global $app;
        $params = array_merge($app['components']['core:view:_globals'], $params);
        if(is_array($params) && count($params)) {
            extract($params, EXTR_SKIP);
        }
        ob_start();
        $file = f('helpers:string:reduce_slashes', $file);
        if (file_exists($file)) {
            include $file;
        } else {
            ob_end_clean();
            trigger_error("View file ($file) not exist!", E_USER_ERROR);
        }
        return ob_get_clean();
    },
    'core:view:render' => function ($view = NULL, $params = []) {
        global $app;
        if(!is_null($view)) {
            f('core:view:compile', $view, $params);
        }
        echo f('core:view:render_file', $app['components']['core:view:_layout'], ['content' => $app['components']['core:view:_content']]);
    },
    'core:view:compile' => function ($view, $params = []) {
        global $app;
        $app['components']['core:view:_content'] .= f('core:view:render_file', f('core:view:get_view_path', $view), $params);
    },
    'core:view:print' => function ($view, $params = [], $return = FALSE) {
        $html = f('core:view:render_file', f('core:view:get_view_path', $view), $params);
        if ($return) {
            return $html;
        }
        echo $html;
    },
    'core:view:set_global' => function($k, $v) {
        global $app;
        $app['components']['core:view:_globals'][$k] = $v;
    },
    'core:view:unset_global' => function($k) {
        global $app;
        if(isset($app['components']['core:view:_globals'][$k])) {
            unset($app['components']['core:view:_globals'][$k]);
        }
    },
    'core:view:get_global' => function($k) {
        global $app;
        return isset($app['components']['core:view:_globals'][$k])
            ? $app['components']['core:view:_globals'][$k]
            : NULL;
    }
];
                