<?php defined('APP_PATH') or die('Access denied!');

/**
 * Route component
 * 
 * @since 0.2
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
        $config = $app['config']['components']['core:route'];
        $uri = explode('?', $_SERVER['REQUEST_URI']);
        $routes = explode('/', $uri[0]);

        // Get controller name
        $controller = !empty($routes[1]) ? strtolower($routes[1]) : $config['default_controller'];
        // Get action name
        $action = !empty($routes[2]) ? strtolower($routes[2]) : $config['default_action'];

        if (f('core:route:load_controller', $controller) && isset($app['controller']["action:$action"])) {
            // Do action
            $app['controller']["action:$action"]();
        } else {
            // 404
            die('404');
        }
    }
];
                