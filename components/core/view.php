<?php defined('APP_PATH') or die('Access denied!');

/**
 * View component
 *
 * @since 0.1
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'core:view:_ver' => '0.1',
    'core:view:_layout' => APP_PATH . 'views' . DIRECTORY_SEPARATOR . 'layout.php',
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
        $app['components']['core:view:_layout'] = APP_PATH . 'views' . DIRECTORY_SEPARATOR . $name . '.php';
    },
    'core:view:render' => function ($view = NULL, $params = NULL) {
        //@todo global varaibles
        if(!is_null($view)) {
            f('core:view:compile', $view, $params);
        }
        global $app;

        extract(['content' => $app['components']['core:view:_content']], EXTR_SKIP);
        ob_start();
        try {
            include $app['components']['core:view:_layout'];
        }
        catch (Exception $e) {
            ob_end_clean();
            //@todo
            throw $e;
        }
        echo ob_get_clean();
    },
    'core:view:compile' => function ($view, $params = NULL) {
        global $app;
        if (is_array($params)) {
            extract($params, EXTR_SKIP | EXTR_REFS);
        }
        ob_start();
        try {
            include APP_PATH . 'views' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $view). '.php';
        }
        catch (Exception $e) {
            ob_end_clean();
            //@todo
            throw $e;
        }
        $app['components']['core:view:_content'] .= ob_get_clean();
    },
    'core:view:print' => function ($view, $params = NULL, $return = FALSE) {
        global $app;
        if (is_array($params)) {
            extract($params, EXTR_SKIP | EXTR_REFS);
        }
        ob_start();
        try {
            include APP_PATH . 'views' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $view). '.php';
        }
        catch (Exception $e) {
            ob_end_clean();
            //@todo
            throw $e;
        }

        $html = ob_get_clean();

        if ($return) {
            return $html;
        }

        echo $html;
    },
];
                