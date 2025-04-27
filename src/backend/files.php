<?php
define('TEST', false);

if (!TEST):
# TODO: * read httpd: Access control
require_once 'variables.php';
require_once 'utils.php';

$requesttype = $_SERVER['REQUEST_METHOD'];
$timeout = new Timeout('../../cache/');
$storagelimit = 5.24288e8;

if (!file_exists(CLOUD_STORAGE_DIR)) {
  header(HTTP_VERSION . ' ' . HTTP_CODE_TITLE['500']);
  verbose(CLOUD_STORAGE_DIR . ' doesn\'t exists. Exiting...');
  die();
}

# the second operand is to force clean cache
# TODO: add an straightfroward way to clear cache
if ($timeout->is_expired() || false) {
  $filelist = new MapManager('../../cache/map.json', CLOUD_STORAGE_DIR,
                             storagelimit: $storagelimit);
  $timeout->set_newtime();
} else $filelist = new MapManager('../../cache/map.json', CLOUD_STORAGE_DIR, cache: true);
  
if ($requesttype == 'GET') { 
  header(HTTP_VERSION . ' ' . HTTP_CODE_TITLE['200']);
  header('Content-Type: application/json');
  header('Content-Length: ' . filesize('../../cache/map.json'));
  echo $filelist->get_map();
  die();
}

verbose('$_FILES:' .  "\n" . print_r($_FILES, true));
verbose('$_REQUEST:'. "\n" . print_r($_REQUEST, true));

if (empty($_FILES) || $_FILES['file']['error']) {
  die(verbose('Failed to move uploaded file.', true, true, 0));
}

$chunk = isset($_REQUEST['chunk'])
  ? intval($_REQUEST['chunk'])
  : 0;
$totalchunks = isset($_REQUEST['chunks'])
  ? intval($_REQUEST['chunks'])
  : 0;

# TODO: handle same name files
$uploadfolder = CLOUD_STORAGE_DIR;
verbose("Upload files path: {$uploadfolder}");

if (!file_exists($uploadfolder)) {
  header(HTTP_VERSION . ' ' . HTTP_CODE_TITLE['500']);
  verbose($uploadfolder . ' doesn\'t exists');
  die();
}

$filename = isset($_REQUEST['name'])
  ? $_REQUEST['name']
  : $_FILES['file']['name'];
verbose("Filename: {$filename}");
$filepath = removedoubledash($uploadfolder . DIRECTORY_SEPARATOR . $filename);
verbose("Save location: {$filepath}");

$filepart = @fopen("{$filepath}.part", $chunk == 0
                     ? 'wb' : 'ab');
if ($filepart) {
  $tmpfile = @fopen($_FILES['file']['tmp_name'], 'rb');

  if ($tmpfile) {
    while ($buff = fread($tmpfile, 4096))
      fwrite($filepart, $buff);
  } else die(verbose('Failed to open input stream.', true, true, 0));

  @fclose($tmpfile);
  @fclose($filepart);

  @unlink($_FILES['file']['tmp_name']);
} else die(verbose('Failed to open input stream.', true, true, 0));

# if successfully upload
if (!$totalchunks || $chunk == $totalchunks - 1) {
  rename("{$filepath}.part", $filepath);

  $filelist->add_newfile($filepath);
  $filelist->update_map();
  $timeout->set_newtime();
}

header(HTTP_VERSION . ' ' . HTTP_CODE_TITLE['200']);
die(verbose('Upload successfull.', out:true, json:true));

else:
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <main>
  <h1>Under maintence. All the functionalities are disabled</h1>
  <pre><code>
  </code></pre>
  </main>
</body>
<?php
endif;
?>
