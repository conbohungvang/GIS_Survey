
<?php
 header('Access-Control-Allow-Origin: *');
include 'db.php';

$check = $_POST['check'];
if($check==='true'){
    $birth = trim($_POST['mybirth']," ");
    // echo $birth;
    $userid = trim($_POST['typeofgeom']," ");
    $pass = trim($_POST['pwd']," ");
    
    if($birth==='0'){
        // echo "chay";
        $add_query = "Insert into public.account(username, pass)Values ('$userid', '$pass');";
    }else{
        $fullname = $_POST['nameofgeom'];
        $sex = $_POST['mysex'];
        $addre = $_POST['myaddr'];
        $add_query = "Insert into public.account(username, pass, fullname, sex, birth, addre)Values ('$userid', '$pass', '$fullname', '$sex', '$birth', '$addre');";
    }
    
    $query = pg_query($dbconn,$add_query);
    if ($query){
        echo json_encode(array("statusCode" => 200));
    } else {
        echo json_encode(array("statusCode" => 201));
    }
}
if($check==="xoa"){
    $idnamefarm = $_POST['idnamefarm'];
    $userid=$_POST['user'];
    $add_query =" UPDATE public.trainuoi SET \"user\"='"."!"."$userid' WHERE name='$idnamefarm'; UPDATE public.\"drawnFeature\" SET \"user\"='"."!"."$userid' WHERE name='$idnamefarm';";
    $query = pg_query($dbconn,$add_query);
    if ($query){
        echo json_encode(array("statusCode" => 200));
    } else {
        echo json_encode(array("statusCode" => 201));
    }
}
if($check==="xoaao"){
    $idnamefarm = $_POST['idnamefarmao'];
    $userid=$_POST['user'];
    $add_query =" UPDATE public.\"drawnFeature\" SET \"user\"='"."!"."$userid' WHERE type='$idnamefarm';";
    $query = pg_query($dbconn,$add_query);
    if ($query){
        echo json_encode(array("statusCode" => 200));
    } else {
        echo json_encode(array("statusCode" => 201));
    }
}
if($check==="edit"){
    $idnamefarm = $_POST['idnamefarm'];
        $manafarm = $_POST['manafarm'];
        $addrfarm = $_POST['addrfarm'];
        $phonefarm = $_POST['phonefarm'];
        $htfarm = $_POST['htfarm'];
        $dtfarm = $_POST['dtfarm'];
        $area = $_POST['area'];
        $add_query = "UPDATE public.trainuoi SET address='$addrfarm', phone='$phonefarm', farming='$htfarm', obj='$dtfarm', area=$area, manager='$manafarm' WHERE name='$idnamefarm';";
        
        // echo "$add_query";
        $query = pg_query($dbconn,$add_query);
        if ($query){
            echo json_encode(array("statusCode" => 200));
        } else {
            echo json_encode(array("statusCode" => 201));
        }
}
if($check==="editao"){
    $idnamefarm = $_POST['idnamefarm'];
    $add=$_POST['add'];
        $add_query = "UPDATE public.\"drawnFeature\" SET add='$add' WHERE type='$idnamefarm';";
        
        // echo "$add_query";
        $query = pg_query($dbconn,$add_query);
        if ($query){
            echo json_encode(array("statusCode" => 200));
        } else {
            echo json_encode(array("statusCode" => 201));
        }
}
    if($check==='false'){
        $userid = $_POST['userid'];
        $idnamefarm = $_POST['idnamefarm'];
        $manafarm = $_POST['manafarm'];
        $addrfarm = $_POST['addrfarm'];
        $phonefarm = $_POST['phonefarm'];
        $htfarm = $_POST['htfarm'];
        $dtfarm = $_POST['dtfarm'];
        $area = $_POST['area'];

        // echo $userid,$idnamefarm,$manafarm,$addrfarm,$phonefarm,$htfarm,$dtfarm,$area;
    
        $add_query = "INSERT INTO public.trainuoi(name, \"user\", address, phone, farming, obj, area, manager)VALUES ('$idnamefarm', '$userid', '$addrfarm', '$phonefarm', '$htfarm', '$dtfarm', $area, '$manafarm')";
        // echo $add_query;
        $query = pg_query($dbconn,$add_query);
        if ($query){
            echo json_encode(array("statusCode" => 200));
        } else {
            echo json_encode(array("statusCode" => 201));
        }
    }





?>