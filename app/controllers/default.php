<?php defined('APP_PATH') or die('Access denied!');

return [
    'action:index' => function() {
        f('core:view:render', 'default/index', ['msg' => 'Hello from controller!']);
    },
    'action:test' => function() {
        echo 'Action test!';
    }
];
        