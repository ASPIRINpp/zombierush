<?php defined('APP_PATH') or die('Access denied!');

/**
 * MySQL Connector component
 *
 * @since 0.5
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'db:mysql:_ver' => '0.5',
    'db:mysql:connections' => [],
    'db:mysql:connect' => function($h, $d, $u, $p) {
        //@todo Returns a MySQL link identifier on failure connection.
        if(($link = mysql_connect($h, $u, $p, TRUE)) && $link === FALSE) {
            trigger_error(mysql_error($link).' #'.mysql_errno($link), E_USER_ERROR);
        }
        if (!mysql_select_db($d, $link)) {
            trigger_error("Can't select '$d' database", E_USER_ERROR);
        }
        return $link;
    },
    'db:mysql:connect_to' => function($name) {
        global $app;
        $config = $app['config']['components']['db:mysql'];
        $name = is_int($name) ? array_keys($config)[$name] : $name;
        if (isset($config[$name])) {
            $app['components']['db:mysql:connections'][$name] = f('db:mysql:connect', $config[$name]['h'], $config[$name]['d'], $config[$name]['u'] ,$config[$name]['p']);
            if(isset($config['charset'])) {
                f('db:mysql:set_charset', $config['charset']);
            }
            return TRUE;
        }
        return FALSE;
    },
    'db:mysql:get_link'=> function($link = 0) {
        global $app;
        $config = $app['config']['components']['db:mysql'];
        $link = is_int($link) ? array_keys($config)[$link] : $link;
        if (!isset($app['components']['db:mysql:connections'][$link])) {
            if (!f('db:mysql:connect_to', $link)) {
                trigger_error("Can't connect to MySQL by $link config section", E_USER_ERROR);
            }
        }
        return $app['components']['db:mysql:connections'][$link];
    },
    'db:mysql:set_charset'=> function($charset, $link = 0) {
        if(!is_resource($link) || get_resource_type($link) !== 'mysql link') {
            $link = f('db:mysql:get_link', $link);
        }
        return function_exists('mysql_set_charset')
            // MySQL 5.x
            ?  mysql_set_charset($charset, $link)
            // MySQL 4.x
            : (bool) mysql_query('SET NAMES '.f('db:mysql:quote', $charset), $link);
    },
    'db:mysql:query' => function($sql, $params = [], $link = 0) {
        if(!is_resource($link) || get_resource_type($link) !== 'mysql link') {
            $link = f('db:mysql:get_link', $link);
        }
        $sql = (is_array($params) && !empty($params)) ? f('db:mysql:build_sql', $sql, $params) : $sql;

        if (($result = mysql_query($sql, $link)) === FALSE) {
            trigger_error(mysql_error($link).' #'.mysql_errno($link), E_USER_ERROR);
        }
        return $result;
    },
    'db:mysql:q_column' => function($sql, $params = [], $col, $link = 0) {
        $r = f('db:mysql:query', $sql, $params, $link);
        $result = array();
        if (!is_null($r)) {
            while ($line = mysql_fetch_array($r, MYSQL_ASSOC)) {
                $result[] = $line[$col];
            }
            mysql_free_result($r);
        }
        return $result;
    },
    'db:mysql:q_current' => function($sql, $params = [], $link = 0) {
        $r = f('db:mysql:query', $sql, $params, $link);
        $result = array();
        if (!is_null($r)) {
            $result = mysql_fetch_assoc($r);
            mysql_free_result($r);
        }
        return !$result ? array() : $result;
    },
    'db:mysql:q_scalar' => function($sql, $params = [], $key = 0, $link = 0) {
        $r = f('db:mysql:query', $sql, $params, $link);
        $result = array();
        if (!is_null($r)) {
            $result = mysql_fetch_assoc($r);
            mysql_free_result($r);
        }
        $result = !$result ? array() : $result;

        return isset($result[$key]) ? $result[$key] : NULL;
    },
    'db:mysql:q_all' => function($sql, $params = [], $link = 0) {
        $r = f('db:mysql:query', $sql, $params, $link);
        $result = array();
        if (!is_null($r)) {
            while ($line = mysql_fetch_array($r, MYSQL_ASSOC)) {
                $result[] = $line;
            }
            mysql_free_result($r);
        }
        return $result;
    },
    'db:mysql:q_insert' => function($sql, $params = [], $link = 0) {
        $link = f('db:mysql:get_link', $link);
        f('db:mysql:query', $sql, $params, $link);
        return [mysql_insert_id($link), mysql_affected_rows($link)];
    },
    'db:mysql:q_update' => function($sql, $params = [], $link = 0) {
        $link = f('db:mysql:get_link', $link);
        f('db:mysql:query', $sql, $params, $link);
        return mysql_affected_rows($link);
    },
    'db:mysql:q_delete' => function($sql, $params = [], $link = 0) {
        $link = f('db:mysql:get_link', $link);
        f('db:mysql:query', $sql, $params, $link);
        return mysql_affected_rows($link);
    },
    'db:mysql:build_sql' => function($sql, $params) {
        if(is_array($params)) {
            foreach ($params as $alias => $value) {
                $sql = str_replace($alias, f('db:mysql:quote', $value), $sql);
            }
        }
        return $sql;
    },
    'db:mysql:escape' => function($value) {
        $link = f('db:mysql:get_link');
        if (($value = mysql_real_escape_string( (string) $value, $link)) === FALSE) {
            trigger_error(mysql_error($link).' #'.mysql_errno($link), E_USER_ERROR);
        }
        return "'$value'";
    },
    'db:mysql:quote' => function($value) {
        switch (TRUE) {
            case ($value === NULL):
                return 'NULL';
                break;
            case is_bool($value):
                return "'".  intval($value)."'";
                break;
            case is_array($value):
                return '('.implode(', ', array_map(gf('db:mysql:quote'), $value)).')';
                break;
            case is_int($value):
                return $value;
                break;
            case is_float($value):
                return sprintf('%F', $value);
                break;
            default:
                return f('db:mysql:escape', $value);
        }
    }
];