<?php defined('APP_PATH') or die('Access denied!');

return [
    'app_name' => 'Zombie rush',
    'components' => [
        'core:cookie' => [
            'enable_salt' => TRUE,
            'salt' => 'qh>ONDl/H[y1d}lZ8{wp[pi!EPt№fyDSB1Lhal%TfDLQtskq"Y'
        ],
        'core:session' => [
            'enable' => FALSE
        ],
        'core:route' => [
            'default_controller' => 'default',
            'default_action' => 'index',
        ]
    ]
];
