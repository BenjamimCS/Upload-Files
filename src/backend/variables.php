<?php
define('HTTP_VERSION', array_key_exists('SERVER_PROTOCOL', $_SERVER)
                         ? $_SERVER['SERVER_PROTOCOL']
                         :NULL);
define('CLOUD_STORAGE_DIR', '../../../../../Downloads/Cloud_Storage/');
define (
  'REQUIRED_HTTP_METHODS',
  $_SERVER['REQUEST_METHOD'] == 'GET' || $_SERVER['REQUEST_METHOD'] == 'HEAD');
define('HTTP_CODE_TITLE', [
  '200' => '200 Ok',
  '201' => '201 Created',
  '400' => '400 Bad Request',
  '401' => '401 Unauthorized',
  '404' => '404 Not Found',
  '405' => '405 Method Not Allowed',
  '500' => '500 Internal Server Error',
  '501' => '501 Not Implemented',
  # TODO: implement the others
]);
define('HTTP_RESPONSE_TIPS', [
  '400' => <<<END
    The server couldn't accomplish the request. Be sure the
    <code>filename</code> query string is available in the URL.
    END,
  '404' => <<<END
    File not found, do access
    <a href='/files'
       class='text-slate-300 underline'><code>/files</code></a>
    to get a list of the available files.
    END,
  '405' => <<<END
    Only the required HTTP methods are available for use.
    END,
  '500' => <<<END
    Looks like the server is running on trouble. Contact
     <a href='mailto:uj1kjfomy@mozmail.com' class='text-slate-400 underline'>
      uj1kjfomy@mozmail.com</a> and let him know.
    END,
]);
