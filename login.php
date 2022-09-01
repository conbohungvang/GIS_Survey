
<?php
 header('Access-Control-Allow-Origin: *');
include 'db.php';


$listacc=$_POST['loadaccount'];

if($listacc === "infor"){
    $farm= $_POST['trainuoi'];
    $sele_query = "SELECT name, manager, address, phone, farming, obj, area FROM public.trainuoi where name='$farm';";

    $query = pg_query($dbconn,$sele_query);
    if ($query){
        $stocks = [];
        while ($row = pg_fetch_object($query)) {
            $stocks[] = [$row->name,$row->manager,$row->address,$row->phone,$row->farming,$row->obj,$row->area];

        }
        echo json_encode($stocks);
    } else {
        echo json_encode(array("statusCode" => 201));
    } 
}
else if($listacc === ""){
    $type = $_POST['typeofgeom'];
    $name = $_POST['nameofgeom'];
    
    $sele_queryacc = "SELECT username, pass, fullname FROM public.account where username = '$type' and pass = '$name';";
    $query = pg_query($dbconn,$sele_queryacc);
    if ($query) {
            $sele_queryf = "SELECT name FROM public.trainuoi where \"user\" = '$type' ;";
            $queryf = pg_query($dbconn,$sele_queryf);
            if ($queryf){
                $stocks = [];
                while ($row = pg_fetch_object($queryf)) {
                    $stocks[] = [$row->name];
                }
                echo json_encode($stocks);
            } else {
                echo json_encode(array("statusCode" => 201));
            }
    }
     else {
        echo json_encode(array("statusCode" => 201));
    }
    
} else{
    $type = $_POST['typeofgeom'];
    $name = $_POST['nameofgeom'];
    $sele_query = "SELECT name FROM public.trainuoi where \"user\" = '$listacc' ;";

    $query = pg_query($dbconn,$sele_query);
    if ($query){
        $stocks = [];
        while ($row = pg_fetch_object($query)) {
            $stocks[] = [$row->name];
        }
        echo json_encode($stocks);
    } else {
        echo json_encode(array("statusCode" => 201));
    }
}




?>