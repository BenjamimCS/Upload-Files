<?php
define('HTTP_VERSION', array_key_exists('SERVER_PROTOCOL', $_SERVER)
                         ? $_SERVER['SERVER_PROTOCOL']
                         :NULL);
define('CLOUD_STORAGE_DIR', '../../../../../Downloads/Cloud_Storage/');
define('HTTP_CODE_TITLE', [
  '200' => '200 Ok',
  '201' => '201 Created',
  '400' => 'Bad Request',
  '404' => 'Not Found',
  '500' => '500 Internal Server Error',
  # TODO: implement the others
]);
