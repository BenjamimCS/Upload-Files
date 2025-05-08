<?php
#$basedir = $_SERVER['DOCUMENT_ROOT'];
$basedir = '../../';
date_default_timezone_set('America/Sao_Paulo');

/**
 * Reorder `$_FILES[index]` array for a readable format
 *
 * It remaps the array
 * ```php
 * from:
 * 'input_name_value'=> [
 *   'tmp_name'=> [0 => ?any, ...], ...];
 * ```
 * to:
 * ```php
 *  'input_name_value'=> [
 *    0 => ['tmp_name': ?any, ...], ...];
 *  ```
 *  @param array $vector
 *  @return array
 */

function diverse_array(array $vector): array {
  $result = array();

  foreach($vector as $key1 => $value1)
    foreach($value1 as $key2 => $value2)
      $result[$key2][$key1] = $value2;

  return $result;
}

function removedoubledash(string $string): string {
  return preg_replace('/\/{2,}/', '/', $string);
}

function verbose(string $message,    bool $out = false,
                 bool $json = false, int $ok=1) {
  #$basedir = $_SERVER['DOCUMENT_ROOT'];
  $basedir = '../../cache/';
  $logphpfilename = 'php.log';
  $logphpfilepath = removedoubledash($basedir . DIRECTORY_SEPARATOR . $logphpfilename);
  $filestream = file_exists($logphpfilepath)
    ? fopen($logphpfilepath, 'ab')
    : fopen($logphpfilepath, 'w');
  $nowtime = date('m/d/Y — H:i:s (e P):');
  $result = $nowtime . ' '.$message . "\n";

  if ($json) {
    $jsonencoded = json_encode([
      'OK' => $ok, 'info' => $message,
      'timestamp' => $nowtime
    ]);
    $result = $jsonencoded."\n";
  }

  fwrite($filestream, $result);
  fclose($filestream);
  if ($out) return $result;
}


/**
 * Handle a *map file*, that is, a file that stores a
 * folder structure in a organized way using data
 * serializing like: JSON, Yaml etc.
 *
 * @param readonly string $map_filepath Path to the *map file*
 * @param readonly string $files_dirpath Path to the folder to
 *                                       be mapped
 * @param int $storagelimit Maximun amount of data stored into a
 *                          directory. If `0` it has no limit.
 * @param bool $cache Reuse the already created *map file*
 *                    Fails if there's no *map file*
 *
 * The JSON file must have the following structure:
 * JSON_FILE->files --> an array of files
 * JSON_FILE->empty --> boolean value if folder is empty
 * JSON_FILE->storageLimit --> the maximum storage limit
 * JSON_FILE->currentFolderSize --> the folder size
 * JSON_FILE->timestamp --> used to calculate the time
 * since last cache.
 *
 * if $this->storagelimit with 0 does'nt define a storage limit
 */
class MapManager {
  #public string    $filename      = $serverbasedir . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'uploadedfiles.json';
  public readonly string $map_filepath;  # cache independent
  public readonly string $filesdir_path; # cache independent
  protected array     $map_filejson; # parsed JSON
  protected string    $map_filecontents;
  protected int       $storagelimit;
  protected int       $folder_currentsize;
  protected $filesdir_stream;

  public function __construct(string $map_filepath, string $filesdir_path,
                              int $storagelimit = 0, bool $cache = false,) {
    $this->filesdir_path                = $filesdir_path;
    $this->map_filepath                 = $map_filepath;
    $this->storagelimit                 = $storagelimit;
    $this->folder_currentsize           = 0;

    $this->map_filejson['storageLimit'] = $this->storagelimit;
    $this->map_filejson['files']        = array();
    $this->map_filejson['empty']        = NULL;
    $this->map_filecontents             = '';
    /*TODO: implement timestamp*/

    verbose('Attempting to open ' . $this->filesdir_path);
    if (!is_dir($this->filesdir_path)) {
      #TODO: RAISES AN ERROR
      verbose('Couldn\'t open folder ' . $this->filesdir_path);
      die();
    }

    verbose('Attempting to open ' . $this->map_filepath);
    if (!is_file($this->map_filepath) && !$this->is_validjson($this->map_filepath)) {
      #TODO: RAISES AN ERROR
      verbose($this->map_filepath . ' might not exists or isn\'t a valid JSON.');
      die();
    }

    verbose('Getting folder structure and feeding Map if necessary...');
    if ($cache) {
      $this->map_filecontents = file_get_contents($this->map_filepath);
      $this->map_filejson = array_merge($this->map_filejson,
                            json_decode($this->map_filecontents, true));
      $this->filesdir_stream = @opendir($this->filesdir_path);
      $this->storagelimit = $this->map_filejson['storageLimit'];
      verbose('Get map cache in ' . $this->map_filepath);
    } else {
      $this->filesdir_stream = @opendir($this->filesdir_path);
      $this->update_map();
      verbose('Directory constructed');
    }
  }

  public function add_newfile(string $filename): bool|string {
    /* Must be called after adding file to the directory
     * otherwise it returns false
     * */
    $filepath = $this->filesdir_path . DIRECTORY_SEPARATOR . $filename;
    verbose('Check existence of file '. $filepath);
    if (!file_exists($filepath)) {
      verbose($filepath . ' doesn\'t exists.');
      return false;
    }
    $this->map_filejson['files'][] = $filepath;
    $this->map_filecontents = json_encode($this->map_filejson);
    verbose($filepath . ' added');
    return $this->map_filecontents;
  }

  public function get_map() {
    return $this->map_filecontents;
  }

  public function update_map() {
    verbose('Upadting map ' . $this->map_filepath);

    if ($this->is_dirempty()){

      $this->map_filejson['currentFolderSize'] = $this->folder_currentsize;
      $this->map_filejson['empty'] = true;
      $this->map_filejson['files'] = array();

      $this->map_filecontents = json_encode($this->map_filejson);
      file_put_contents($this->map_filepath, $this->map_filecontents);

      verbose('Directory empty. Map updated');
      return;
    }

    # open UPLOADS folder
    $this->scandir();
    $this->set_foldersize();

    $this->map_filejson['currentFolderSize'] = $this->folder_currentsize;
    $this->map_filejson['empty']             = false;

    $this->map_filecontents = json_encode($this->map_filejson);
    file_put_contents($this->map_filepath, $this->map_filecontents);

    verbose('Map updated');
  }

  /**
   *  Populate `$this->map_filejson['files']` with file entries
   * */
  protected function scandir() {
    $this->map_filejson['files'] = array();

    while(false !== ($entry = readdir($this->filesdir_stream))) {
      if ($entry == '.' || $entry == '..') continue;
      $this->map_filejson['files'][] = [
        'name' => $entry,
        'size' => filesize(realpath($this->filesdir_path. DIRECTORY_SEPARATOR . $entry)),
        'uploaded' => true,
      ];
    }
    @rewinddir($this->filesdir_stream);
  }

  # going depracted, the script is scanning two times the directory
  # ($this->scandir and $this->set_foldersize)
  #  1. the best solution is to keep the function and update it only
  #  2. the other is to use Trait to reuse some functions
  #  3. map the $this->map_filejson to sum each filesize and add to
  #    the key $this->map_filejson['currentFolderSize']
  protected function set_foldersize() {
    $realpathname = realpath($this->filesdir_path);
    $accumulator = 0;
    @rewinddir($this->filesdir_stream);
    while(false !== ($entry = readdir($this->filesdir_stream))) {
      if ($entry == '.' || $entry == '..') continue;

      $accumulator += filesize($realpathname . DIRECTORY_SEPARATOR . $entry);
    }
    $this->folder_currentsize = $accumulator;
  }

  /** Close the folder resource
    * */
  public function close() {
    closedir($this->filesdir_stream);
  }

  /** Checks for any entrie rather than `.` and `..` in a folder
    * */
  protected function is_dirempty() {
    #if (!is_dir($dir)) return NULL;

    #$count_dircontents = count(scandir($dir));
    #return ($count_dircontents == 2);
    @rewind($this->filesdir_stream);
    while(false !== ($entry = readdir($this->filesdir_stream))) {
      if ($entry === '.' || $entry === '..') continue;

      $this->map_filejson['empty'] = false;
      break;
    }
    @rewinddir($this->filesdir_stream);

    return $this->map_filejson['empty'];
  }

  protected function is_validjson($filepath): bool|NULL {
    $filecontents = file_get_contents($filepath);
    return $filecontents
      ? (bool) json_decode($filecontents)
      : NULL;
  }
}

/**
 * Creates a timeout file (if none) with the current *timestamp*
 * named `timeout` at `$basedir`
 *
 * Create and manage the timeout by comparing the `timestamp` from
 * the *timeout file* and the new one (at instanciation time).
 *
 * @param readonly string $basedir The folder where to find the
 * `timeout` file
 * @param int $timeout: (Default: `3600 * 36` - 1.5 day)
 *
 */
class Timeout {
  protected string $basedir;
  protected int $timeout;
  protected string $timeout_filepath;
  protected int $nowtime;
  protected int $prevtime;

  public function __construct(string $basedir, int $timeout = (3600 * 36)) {
    $this->basedir = $basedir;
    $this->timeout = $timeout;
    $this->nowtime = time();
    $this->timeout_filepath = removedoubledash($this->basedir . DIRECTORY_SEPARATOR . 'timeout');

    if (!file_exists($this->timeout_filepath)) {
      file_put_contents($this->timeout_filepath, time());
    }

    $this->prevtime = (int) file_get_contents($this->timeout_filepath);
  }

  /**
   * Test if *timeout* has been expired
   *
   * @return bool
   */
  public function is_expired(): bool {
    verbose("Delta {$this->nowtime} - {$this->prevtime}:" . $this->nowtime - $this->prevtime);

    return ($this->nowtime - $this->prevtime) >= $this->timeout;
  }

  /**
   * Define new *timestamp for further comparisons (updates `timeout` file)
   *
   * @param int $newtimeout (Defaults: *`timestamp` from instanciation time*)
   * The new *timestamp*.
   */
  public function set_newtime(int|NULL $timestamp=null) {
    $timestamp = $newtimeout ?? $this->nowtime;
    file_put_contents($this->timeout_filepath,$timestamp);
  }
}
?>
