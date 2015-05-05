<?php defined('APP_PATH') or die('Access denied!');

/**
 * Array methods
 *
 * @since 0.2
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'helpers:arr:_ver' => '0.2',
    'helpers:arr:get' => function ($key, $arr, $default = NULL) {
        return isset($arr[$key]) ? $arr[$key] : $default;
    },
    'helpers:arr:pluck_key' => function ($arr, $key) {
        $values = array();
        foreach ($arr as $row)
            if (isset($row[$key])) {
                $values[$row[$key]] = $row;
                unset($values[$row[$key]][$key]);
            }
        return $values;
    }
];


