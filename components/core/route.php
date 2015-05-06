<?php defined('APP_PATH') or die('Access denied!');

/**
 * Route component
 *
 * @since 0.5
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'core:route:_ver' => '0.5',
    'core:route:_patterns' => [
        // Pattern of a <segment>
        'key' => '<([a-zA-Z0-9_]++)>',
        // Part of a <segment> value
        'segment' => '[^/.,;?\n]++',
        // What must be escaped
        'escape' => '[.\\+*?[^\\]${}=!|]'
    ],
    'core:route:load_controller' => function($name) {
        global $app;
        $path = APP_PATH . 'controllers' . DIRECTORY_SEPARATOR .  $name . '.php';
        if(file_exists($path)) {
            $app['controller'] = include $path;
            return TRUE;
        }
        return FALSE;
    },
    'core:route:match' => function($uri, $route, $params) {
        $uri = trim($uri, '/');
        list ($default, $regex) = $params;

        // Check route
        if (!preg_match(f('core:route:compile', $route, $regex), $uri, $matches)) {
            return FALSE;
        }

        // Unset not named matches
        foreach ($matches as $key => $value) {
            if (is_int($key)) {
                unset($matches[$key]);
            }
        }

        // Replace to default, not set or empty values
        foreach ($default as $key => $value) {
            if (!isset($matches[$key]) || $matches[$key] === '') {
                $matches[$key] = $value;
            }
        }

        return $matches;
    },
    'core:route:compile' => function ($route, array $regex = NULL) {
        global $app;
        $patterns = $app['components']['core:route:_patterns'];
        $ex = preg_replace('#'.$patterns['escape'].'#', '\\\\$0', $route);
        // Make optional parts of the URI non-capturing and optional
        $ex = (strpos($ex, '(') !== FALSE)
            ? str_replace(['(', ')'], ['(?:', ')?'], $ex)
            : $ex;
        // Insert default regex for keys
        $ex = str_replace(['<', '>'], ['(?P<', '>'.$patterns['segment'].')'], $ex);
        // Compile regexp
        if ($regex) {
            $search = $replace = [];
            foreach ($regex as $key => $value) {
                $search[]  = "<$key>".$patterns['segment'];
                $replace[] = "<$key>$value";
            }
            $ex = str_replace($search, $replace, $ex);
        }
        return '#^'.$ex.'$#uD';
    },
    'core:route:go' => function () {
        global $app;
        // @todo create request component and load in GET params?
        $uri = explode('?', $_SERVER['REQUEST_URI']);
        $routes = explode('/', trim($uri[0], '/'), 3);

        $i = count($routes);
        $action = !empty($routes[--$i]) ? strtolower($routes[$i]) : $app['config']['components']['core:route']['default_action'];
        $controller = !empty($routes[--$i]) ? strtolower($routes[$i]) : $app['config']['components']['core:route']['default_controller'];

        if (($user_routers = f('helpers:arr:get', 'routes', $app['config']['components']['core:route'], FALSE)) != FALSE) {
            // @todo optimize this block
            foreach ($user_routers as $route => $params) {
                if ($params = f('core:route:match', $uri[0], $route, $params)) {
                    $action = $params['action'];
                    $controller =  $params['controller'];
                    unset($params['action']);
                    unset($params['controller']);
                    break;
                }
            }
        }

        if (f('core:route:load_controller', $controller) && isset($app['controller']["action:$action"])) {
            // Do action
            $app['controller']["action:$action"](isset($params) ? $params : []);
        } else {
            header("HTTP/1.0 404 Not Found");
            f('core:view:render', 'error/index', ['code' => 404, 'msg' => 'Page not found!']);
        }
    }
];