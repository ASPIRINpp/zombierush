<?php defined('APP_PATH') or die('Access denied!');

return [
    'action:500' => function() {
        f('core:view:render', 'error/index', ['code' => 500, 'msg' => 'Server error!']);
    },
    'action:404' => function() {
        f('core:view:render', 'error/index', ['code' => 404, 'msg' => 'Page not found!']);
    },
];

