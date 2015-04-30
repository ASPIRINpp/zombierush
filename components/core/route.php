<?php defined('APP_PATH') or die('Access denied!');

/**
 * Route component
 *
 * @since 0.3
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'core:route:_ver' => '0.2',
    'core:route:load_controller' => function($name) {
        global $app;
        $path = APP_PATH . 'controllers' . DIRECTORY_SEPARATOR .  $name . '.php';
        if(file_exists($path)) {
            $app['controller'] = include $path;
            return TRUE;
        }
        return FALSE;
    },
    'core:route:go' => function () {
        global $app;
        // @todo create request component and load in GET params?
        $uri = explode('?', $_SERVER['REQUEST_URI']);
        $routes = explode('/', trim($uri[0],'/'), 3);

        $i = count($routes);
        $action = !empty($routes[--$i]) ? strtolower($routes[$i]) : $app['config']['components']['core:route']['default_action'];
        $controller = !empty($routes[--$i]) ? strtolower($routes[$i]) : $app['config']['components']['core:route']['default_controller'];

        if (f('core:route:load_controller', $controller) && isset($app['controller']["action:$action"])) {
            // Do action
            $app['controller']["action:$action"]();
        } else {
            // @todo create error controller
            header("HTTP/1.0 404 Not Found");
        }
    }
];
                