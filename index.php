<?php

// Directory with index.php
define('DOC_ROOT', realpath(dirname(__FILE__)) . DIRECTORY_SEPARATOR);

require_once 'app.php';

// Go
init('app', 'components');

// Start session
if (SESSION_ENABLE) {
    f('core:session:open');
}

// Routing
f('core:route:go');
