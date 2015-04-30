<?php defined('APP_PATH') or die('Access denied!');

/**
 * Profiling methods
 *
 * @since 0.1
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'core:profiling:_results' => [],
    'core:profiling:start' => function($id = 0) {
        global $app;
        $app['components']['core:profiling:_results'][$id] = ['start' => microtime(true)];
    },
    'core:profiling:end' => function($id = 0) {
        $end = microtime(true);

        global $app;
        $res = $app['components']['core:profiling:_results'][$id];
        $res['end'] = $end;
        $res['time'] = $end - $res['start'];

        $app['components']['core:profiling:_results'][$id] = $res;
    },
    'core:profiling:results' => function($id = 0) {
        global $app;
        return $app['components']['core:profiling:_results'][$id];
    },
    'core:profiling:time' => function($id = 0) {
        global $app;
        return  $app['components']['core:profiling:_results'][$id]['time'];
    },
    'core:profiling:js_log' => function() {
        global $app;
        $results = $app['components']['core:profiling:_results'];
        $html = '<script type="text/javascript">';
        foreach ($results as $k => $res) {
            $html .= "console.groupCollapsed('Profiling $k');";
            foreach ($res as $x => $v) {
                $html .= "console.log('$x: $v sec.');";
            }
            $html .= "console.groupEnd();";
        }
        $html .= '</script>';

        return $html;
    },
];