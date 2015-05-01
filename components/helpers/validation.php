<?php

defined('APP_PATH') or die('Access denied!');

/**
 * Validation methods
 *
 * @since 0.2
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'helpers:validation:_ver' => '0.2',
    'helpers:validation:check' => function ($arr, $rules) {
        $res = [];
        foreach ($rules as $rule) {
            if (!isset($arr[$rule[0]]) && $rule[1] !== 'not_empty') {
                continue;
            }
            $val = isset($arr[$rule[0]]) ? $arr[$rule[0]] : NULL;

            $params = isset($rule[2]) && is_array($rule[2]) ? $rule[2] : [];
            $val = call_user_func_array('f', array_merge(["helpers:validation:{$rule[1]}", $val], $params));
            if(!$val) {
                if(!isset($res[$rule[0]])) {
                    $res[$rule[0]] = [];
                }
                $res[$rule[0]][] = $rule[1];
            }
        }
        return ['success' => empty($res), 'errors' => $res];
    },
    'helpers:validation:not_empty' => function($val) {
        return !in_array($val, array(NULL, FALSE, '', array()), TRUE);
    },
    'helpers:validation:regex' => function($val, $ex) {
        return (bool) preg_match($ex, (string) $val);
    },
    'helpers:validation:min_length' => function($val, $len) {
        return f('helpers:string:utf8_strlen', $val) >= $len;
    },
    'helpers:validation:max_length' => function($val, $len) {
        return f('helpers:string:utf8_strlen', $val) <= $len;
    },
    /**
     * Email validation
     * @see http://www.w3.org/Protocols/rfc822/
     * @see http://www.iamcal.com/publish/articles/php/parsing_email/
     *
     * @param   string  $email  email address
     * @param   boolean $strict strict RFC compatibility
     * @return  boolean
     */
    'helpers:validation:email' => function($email, $strict = FALSE) {
        if (f('helpers:string:utf8_strlen', $email) > 254) {
            return FALSE;
        }

        if ($strict === TRUE) {
            $qtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
            $dtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
            $atom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
            $pair = '\\x5c[\\x00-\\x7f]';

            $domain_literal = "\\x5b($dtext|$pair)*\\x5d";
            $quoted_string = "\\x22($qtext|$pair)*\\x22";
            $sub_domain = "($atom|$domain_literal)";
            $word = "($atom|$quoted_string)";
            $domain = "$sub_domain(\\x2e$sub_domain)*";
            $local_part = "$word(\\x2e$word)*";

            $expression = "/^$local_part\\x40$domain$/D";
        } else {
            $expression = '/^[-_a-z0-9\'+*$^&%=~!?{}]++(?:\.[-_a-z0-9\'+*$^&%=~!?{}]+)*+@(?:(?![-.])[-a-z0-9.]+(?<![-.])\.[a-z]{2,6}|\d{1,3}(?:\.\d{1,3}){3})$/iD';
        }

        return (bool) preg_match($expression, (string) $email);
    },
    /**
     * Alphabet
     */
    'helpers:validation:alpha' => function($str, $utf8 = FALSE) {
        $str = (string) $str;
        return $utf8 === TRUE ? (bool) preg_match('/^\pL++$/uD', $str) : ctype_alpha($str);
    },
    /**
     * Latin alphabet, numbers, symbols "_" and "-" (great for login)
     */
    'helpers:validation:login' => function($str) {
        return !preg_match('/[^(\w)|(\_)|(\-)]/', (string) $str);
    },
    /**
     * Latin alphabet, numbers, symbols: "_", "-", "." (great for email login)
     */
    'helpers:validation:email_login' => function ($str) {
        return !preg_match('/[^(\w)|(\_)|(\.)|(\-)]/', (string) $str);
    },
    /**
     * Alphabet & numbers
     */
    'helpers:validation:alpha_numeric' => function($str, $utf8 = FALSE) {
        return $utf8 === TRUE ? (bool) preg_match('/^[\pL\pN]++$/uD', $str) : ctype_alnum($str);
    },
    /**
     * Alphabet & dash
     */
    'helpers:validation:alpha_dash' => function($str, $utf8 = FALSE) {
        $regex = $utf8 === TRUE ? '/^[-\pL\pN_]++$/uD' : '/^[-a-z0-9_]++$/iD';
        return (bool) preg_match($regex, $str);
    },
    /**
     * Digit
     */
    'helpers:validation:digit' => function($str, $utf8 = FALSE) {
        return $utf8 === TRUE ? (bool) preg_match('/^\pN++$/uD', $str) : (is_int($str) AND $str >= 0) OR ctype_digit($str);
    },
    /**
     * Digit or decimal
     */
    'helpers:validation:numeric' => function($str) {
        list($decimal) = array_values(localeconv());
        return (bool) preg_match('/^-?+(?=.*[0-9])[0-9]*+'.preg_quote($decimal).'?+[0-9]*+$/D', (string) $str);
    }
];


        