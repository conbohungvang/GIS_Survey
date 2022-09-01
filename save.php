
<?php
 header('Access-Control-Allow-Origin: *');
include 'db.php';


$type = $_POST['typeofgeom'];
$name = $_POST['nameofgeom'];
$user = $_POST['userid'];
$stringgeom = $_POST['stringofgeom'];
$dt =$_POST['area'];
$addr=$_POST['addr'];
// echo $stringgeom;
$add_query = "Insert into public.\"drawnFeature\" (type,name,\"user\",geom,add,dientich) Values ('$type','$name','$user',ST_GeomFromGeoJSON('$stringgeom'),'$addr','$dt')";

$query = pg_query($dbconn,$add_query);
if ($query){
    echo json_encode(array("statusCode" => 200));
} else {
    echo json_encode(array("statusCode" => 201));
}



?>