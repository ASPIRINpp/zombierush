<?php defined('APP_PATH') or die('Access denied!');

return [
    'action:index' => function() {
        f('core:view:render', 'default/index');
    }
];
        