<?php defined('APP_PATH') or die('Access denied!');

return [
    'app_name' => 'You app',
    'components' => [
        'core:route' => [
            'default_controller' => 'default',
            'default_action' => 'index'
        ]
    ]
];
