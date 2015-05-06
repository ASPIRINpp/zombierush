<?php defined('APP_PATH') or die('Access denied!');

/**
 * String methods
 *
 * @since 0.5
 * @author Bogomazov Bogdan (ASPIRIN++) <b.bogomazov@gamil.com>
 */
return [
    'helpers:string:_ver' => '0.5',
    'helpers:string:b_strlen' => function ($binary_string) {
        return function_exists('mb_strlen') ? mb_strlen($binary_string, '8bit') : strlen($binary_string);
    },
    'helpers:string:b_substr' => function ($binary_string, $start, $length) {
        return function_exists('mb_substr') ? mb_substr($binary_string, $start, $length, '8bit') : substr($binary_string, $start, $length);
    },
    'helpers:string:utf8_strlen' => function ($string) {
        if (function_exists('mb_strlen')) {
            return mb_strlen($string, 'UTF-8');
        }
        return f('helpers:string:is_ascii', $string) ? strlen($string) : strlen(utf8_decode($string));
    },
    'helpers:string:utf8_substr' => function ($str, $offset, $length = NULL) {
        // If not exist mb_substr, oh good...
        if(function_exists('mb_substr')) {
            return ($length === NULL)
                ? mb_substr($str, $offset, f('helpers:string:utf8_strlen', $str), 'UTF-8')
                : mb_substr($str, $offset, $length, 'UTF-8');
        }
        // Maybe is ASCII, or o-oh...
        if (f('helpers:string:is_ascii', $str)) {
            return ($length === NULL) ? substr($str, $offset) : substr($str, $offset, $length);
        }

        /**
         * Ok, it this moment...
         * @author Harry Fuecks
         */
        // Normalize params
        $str    = (string) $str;
        $strlen = f('helpers:string:utf8_strlen', $str);
        $offset = (int) ($offset < 0) ? max(0, $strlen + $offset) : $offset; // Normalize to positive offset
        $length = ($length === NULL) ? NULL : (int) $length;

        // Impossible
        if ($length === 0 OR $offset >= $strlen OR ($length < 0 AND $length <= $offset - $strlen))
            return '';

        // Whole string
        if ($offset == 0 AND ($length === NULL OR $length >= $strlen))
            return $str;

        // Build regex
        $regex = '^';

        // Create an offset expression
        if ($offset > 0)
        {
            // PCRE repeating quantifiers must be less than 65536, so repeat when necessary
            $x = (int) ($offset / 65535);
            $y = (int) ($offset % 65535);
            $regex .= ($x == 0) ? '' : ('(?:.{65535}){'.$x.'}');
            $regex .= ($y == 0) ? '' : ('.{'.$y.'}');
        }

        // Create a length expression
        if ($length === NULL)
        {
            $regex .= '(.*)'; // No length set, grab it all
        }
        // Find length from the left (positive length)
        elseif ($length > 0)
        {
            // Reduce length so that it can't go beyond the end of the string
            $length = min($strlen - $offset, $length);

            $x = (int) ($length / 65535);
            $y = (int) ($length % 65535);
            $regex .= '(';
            $regex .= ($x == 0) ? '' : ('(?:.{65535}){'.$x.'}');
            $regex .= '.{'.$y.'})';
        }
        // Find length from the right (negative length)
        else
        {
            $x = (int) (-$length / 65535);
            $y = (int) (-$length % 65535);
            $regex .= '(.*)';
            $regex .= ($x == 0) ? '' : ('(?:.{65535}){'.$x.'}');
            $regex .= '.{'.$y.'}';
        }

        preg_match('/'.$regex.'/us', $str, $matches);
        return $matches[1];
    },
    'helpers:string:is_ascii' => function ($string) {
        return !preg_match('/[^\x00-\x7F]/S', is_array($string) ? implode($string) : $string);
    },
    'helpers:string:html_encode' => function ($string, $charset = 'UTF-8', $double_encode = true) {
        return htmlspecialchars($string, ENT_QUOTES | ENT_SUBSTITUTE, $charset, $double_encode);
    },
    'helpers:string:html_decode' => function ($string) {
        return htmlspecialchars_decode($string, ENT_QUOTES);
    },
    'helpers:string:translit' => function ($str) {
        $tr = array(
            "А" => "a", "Б" => "b", "В" => "v", "Г" => "g",
            "Д" => "d", "Е" => "e", "Ж" => "j", "З" => "z", "И" => "i",
            "Й" => "y", "К" => "k", "Л" => "l", "М" => "m", "Н" => "n",
            "О" => "o", "П" => "p", "Р" => "r", "С" => "s", "Т" => "t",
            "У" => "u", "Ф" => "f", "Х" => "h", "Ц" => "ts", "Ч" => "ch",
            "Ш" => "sh", "Щ" => "sch", "Ъ" => "", "Ы" => "yi", "Ь" => "",
            "Э" => "e", "Ю" => "yu", "Я" => "ya", "а" => "a", "б" => "b",
            "в" => "v", "г" => "g", "д" => "d", "е" => "e", "ж" => "j",
            "з" => "z", "и" => "i", "й" => "y", "к" => "k", "л" => "l",
            "м" => "m", "н" => "n", "о" => "o", "п" => "p", "р" => "r",
            "с" => "s", "т" => "t", "у" => "u", "ф" => "f", "х" => "h",
            "ц" => "ts", "ч" => "ch", "ш" => "sh", "щ" => "sch", "ъ" => "y",
            "ы" => "yi", "ь" => "", "э" => "e", "ю" => "yu", "я" => "ya",
            " " => "-", "." => "", "/" => "-", "Ё" => "E", "ё" => "e",
        );

        $str = strtr($str, $tr);
        $str = strtolower($str);
        $str = preg_replace('~[^-a-z0-9_]+~u', '-', $str);
        $str = trim($str, "-");
        $str = str_replace(array('---', '--'), '-', $str);

        return $str;
    },
    'helpers:string:mb_ucfirst' => function ($str, $encoding = 'UTF-8') {
        $firstChar = mb_substr($str, 0, 1, $encoding);
        $then = mb_substr($str, 1, mb_strlen($str), $encoding);
        return mb_strtoupper($firstChar, $encoding) . $then;
    },
    'helpers:string:human_numbers' => function ($num, $decimals = 1, $dec_point = ",", $thousands_sep = " ", $sym = array('k', 'm')) {
        return ($num > 1000) ? number_format($num / 1000, $decimals, $dec_point, $thousands_sep) . $sym[0] : $num;
    },
    'helpers:string:plural' =>function ($n, $a, $b, $c) {
        return $n % 10 == 1 && $n % 100 != 11 ? $a : ($n % 10 >= 2 && $n % 10 <= 4 && ($n % 100 < 10 || $n % 100 >= 20) ? $b : $c);
    },
    'helpers:string:clear_search_query' =>function ($q) {
        return preg_replace('/[^a-zA-ZА-Яа-я0-9\s]/u', '', strip_tags($q));
    },
    'helpers:string:reduce_slashes' =>function ($str) {
        return preg_replace('#(?<!:)//+#', '/', $str);
    },
    'helpers:string:limit_chars' =>function ($str, $limit = 100, $end_char = NULL, $preserve_words = FALSE) {
        $end_char = ($end_char === NULL) ? '…' : $end_char;
        $limit = (int) $limit;
        if (trim($str) === '' OR f('helpers:string:utf8_strlen', $str) <= $limit) {
            return $str;
        }
        if ($limit <= 0) {
            return $end_char;
        }
        if ($preserve_words === FALSE) {
            return rtrim(f('helpers:string:utf8_substr', $str, 0, $limit)).$end_char;
        }
        // Don't preserve words. The limit is considered the top limit.
        // No strings with a length longer than $limit should be returned.
        if ( ! preg_match('/^.{0,'.$limit.'}\s/us', $str, $matches)) {
            return $end_char;
        }

        return rtrim($matches[0]).((strlen($matches[0]) === strlen($str)) ? '' : $end_char);
    },
    /**
     * Markup to text
     * @see http://php.net/nl2br on steroids
     */
    'helpers:string:markup' =>function ($str, $br = TRUE) {
        $str = str_replace(["\r\n", "\r"], "\n", $str);
        $str = preg_replace('~^[ \t]+~m', '',  preg_replace('~[ \t]+$~m', '', $str));
        if ($html = (strpos($str, '<') !== FALSE)) {
            $tags = '(?:p|div|h[1-6r]|ul|ol|li|pre|blockquote|d[dlt]|t[dhr]|t(?:able|body|foot|head)|c(?:aption|olgroup)|form|s(?:elect|tyle)|a(?:ddress|rea)|ma(?:p|th))';
            $str = preg_replace('~</'.$tags.'\s*+>$~im', "$0\n", preg_replace('~^<'.$tags.'[^>]*+>~im', "\n$0", $str));
        }
        $str = preg_replace('~\n{2,}~', "</p>\n\n<p>", '<p>'.trim($str).'</p>');
        $str = ($html !== FALSE) ? preg_replace('~(</?'.$tags.'[^>]*+>)</p>~i', '$1', preg_replace('~<p>(?=</?'.$tags.'[^>]*+>)~i', '', $str)) : $str;
        return ($br === TRUE) ? preg_replace('~(?<!\n)\n(?!\n)~', "<br />\n", $str) : $str;
    }
];