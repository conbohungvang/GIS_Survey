
<?php
 header('Access-Control-Allow-Origin: *');
$server = 'localhost';
$username = 'postgres';
$password = 'nhatb1704760';
$db_name = 'survey_application';

$dbconn = pg_connect("host=$server port=5432 dbname=$db_name user=$username password=$password");


?>