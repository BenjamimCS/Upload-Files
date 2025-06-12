<?php
namespace {
require_once getenv('PHP_ROOT') . '/vendor/autoload.php';
require_once getenv('PHP_ROOT') . '/Templates/http_error.php';
require_once getenv('PHP_ROOT') . '/Resources/variables.php';

$client_password = isset($_POST['password']) ? $_POST['password']: '';

if (!$client_password) {
  header(HTTP_VERSION . ' ' . HTTP_CODE_TITLE['400']);
  echo HTTP_CODE_TITLE['400'] . "\n"
    ."Empty password or field missing.\n";
}

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Dotenv\Dotenv::createImmutable(getenv('PHP_ROOT'))->load();

$password_hash = $_ENV['PASS_HASH_SHA256'];
$secret        = $_ENV['SECRET'];

$auth_token = JWT::encode(['user'=> 1000], $secret, 'HS256');

if ($password_hash === $client_password) {
  header(HTTP_VERSION . ' ' . HTTP_CODE_TITLE['201']);
  setcookie('token', 'Bearer ' . $auth_token, [
    'samesite' => 'Strict',
    'path' => '/files',
    'httponly' => true,
    'expires' => time()+60*30,
  ]);
  die();
}

}
?>
