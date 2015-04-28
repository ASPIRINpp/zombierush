<?php defined('APP_PATH') or die('Access denied!');

/**
 * Password hashing methods
 * 
 * Hash are compability for hash_equals & password_hash functions for php PHP 5 >= 5.5.0
 * Used the CRYPT_BLOWFISH algorithm
 * @see http://php.net/manual/ru/function.hash-equals.php
 * @see http://php.net/manual/ru/function.password-hash.php
 * @since 0.2
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'helpers:password:_ver' => '0.2',
    /**
     * Hash password
     * @param string Password
     * @param string Salt
     * @return string Hash
     * @see http://php.net/manual/ru/function.password-hash.php
     */
    'helpers:password:hash' => function ($password, $salt = NULL) {
        // The length of salt to generate
        $raw_salt_len = 16;
        if (is_null($salt)) {
            $buffer = '';
            $buffer_valid = false;
            if (function_exists('mcrypt_create_iv') && !defined('PHALANGER')) {
                $buffer = mcrypt_create_iv($raw_salt_len, MCRYPT_DEV_URANDOM);
                if ($buffer) {
                    $buffer_valid = true;
                }
            }
            if (!$buffer_valid && function_exists('openssl_random_pseudo_bytes')) {
                $buffer = openssl_random_pseudo_bytes($raw_salt_len);
                if ($buffer) {
                    $buffer_valid = true;
                }
            }
            if (!$buffer_valid && @is_readable('/dev/urandom')) {
                $file = fopen('/dev/urandom', 'r');
                $read = f('helpers:string:b_strlen', $buffer);
                while ($read < $raw_salt_len) {
                    $buffer .= fread($file, $raw_salt_len - $read);
                    $read = f('helpers:string:b_strlen', $buffer);
                }
                fclose($file);
                if ($read >= $raw_salt_len) {
                    $buffer_valid = true;
                }
            }
            if (!$buffer_valid || f('helpers:string:b_strlen', $buffer) < $raw_salt_len) {
                $buffer_length = f('helpers:string:b_strlen', $buffer);
                for ($i = 0; $i < $raw_salt_len; $i++) {
                    if ($i < $buffer_length) {
                        $buffer[$i] = $buffer[$i] ^ chr(mt_rand(0, 255));
                    } else {
                        $buffer .= chr(mt_rand(0, 255));
                    }
                }
            }

            // Encode string with the Base64 variant used by crypt
            $base64_digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            $bcrypt64_digits = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            $base64_string = base64_encode($buffer);
            $salt = strtr(rtrim($base64_string, '='), $base64_digits, $bcrypt64_digits);
            $salt = f('helpers:string:b_substr', $salt, 0, 22);
        }

        $hash = sprintf("$2y$%02d$", 10) . $salt;

        $ret = crypt($password, $hash);
        if (!is_string($ret) || f('helpers:string:b_strlen', $ret) != 60) {
            return false;
        }
        return $ret;
    },
    /**
     * Verify password
     * @param string $password Password
     * @param string $hash Hash
     * @return bool Result
     * @see http://php.net/manual/ru/function.hash-equals.php
     */
    'helpers:password:verify' => function ($password, $hash) {
        $ret = crypt($password, $hash);
        if (!is_string($ret) || f('helpers:string:b_strlen', $ret) != f('helpers:string:b_strlen', $hash) || f('helpers:string:b_strlen', $ret) <= 13) {
            return false;
        }
        $status = 0;
        for ($i = 0; $i < f('helpers:string:b_strlen', $ret); $i++) {
            $status |= (ord($ret[$i]) ^ ord($hash[$i]));
        }
        return $status === 0;
    }
];