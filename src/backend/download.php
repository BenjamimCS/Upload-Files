<?php
require_once 'variables.php';
require_once 'error.php';

if (!REQUIRED_HTTP_METHODS) {
  header(HTTP_VERSION .  ' ' . HTTP_CODE_TITLE['405']);
  die();
}

if (!isset($_GET['filename'])) {
  header(HTTP_VERSION . ' ' . HTTP_CODE_TITLE['400']);
  die();
}

require_once 'utils.php';

$file_name = $_GET['filename'];
$file_path = realpath(CLOUD_STORAGE_DIR . DIRECTORY_SEPARATOR);
$file_fullpath = $file_path . DIRECTORY_SEPARATOR . $file_name;

if (!file_exists(CLOUD_STORAGE_DIR)) {
  header(HTTP_VERSION . ' ' . HTTP_CODE_TITLE['500']);
  die();
}

if (!is_file($file_fullpath)) {
  header(HTTP_VERSION . ' ' . HTTP_CODE_TITLE['404']);
  die();
}
$file_size = filesize($file_fullpath);
$file_mimetype = mime_content_type($file_fullpath);
verbose("{$file_fullpath}");

header(HTTP_VERSION . ' ' . HTTP_CODE_TITLE['200']);
header("Content-Type: {$file_mimetype}");
header("Content-Length: {$file_size}");
header("Content-Disposition: attachment; filename=\"{$file_name}\"");

readfile($file_fullpath);
