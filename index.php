<?php

// Directory with index.php
define('DOC_ROOT', realpath(dirname(__FILE__)) . DIRECTORY_SEPARATOR);

require_once 'app.php';

// Go
init('app', 'components');

// Routing
f('core:route:go');
