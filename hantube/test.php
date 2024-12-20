<?php
header("Content-type: application/json; charset=utf-8");

$username = "root";
$password = "";
$hostname = "localhost";
$database = "test";
$hasil = [
    "status"=> "",
    "result"=>""
];

$conn = mysqli_connect($hostname,$username,$password,$database);

if(!$conn){
    $hasil['status'] = mysqli_connect_errno();
    $hasil['result'] = "Error : ". mysqli_connect_error();    
}else if(isset($_GET['type']) && isset($_GET['un']) && isset($_GET['ps'])){     
    switch($_GET['type']){
        case "1":
            $un = $_GET['un'];
            $ps = $_GET['ps'];
            $hasil['result'] = login($un,$ps);
            break;
        case "2":
            $un = $_POST['un'];
            $ps = $_POST['pass'];
            $pl = $_POST['pl'];
            $em = $_POST['em'];
            $hs = $_POST['hs'];
            // $hasil['status'] = "200";
            // $hasil['result'] = $_POST;
            $hasil['result'] = newUser($un,$ps,$em,$pl,$hs);
            break;
        default :
            $un = $_GET['un'];
            $hasil['result'] = getData($un);
            break; 
    }  
}else{
    $hasil['status'] = "300";
}

echo json_encode($hasil);

function getData($un){
    global $conn, $hasil;
    $query = "SELECT * FROM hantub_user WHERE username='$un'";
    $result = mysqli_query($conn,$query);
    if($result->num_rows > 0){
        $hasil['status'] = "200";
        $data = mysqli_fetch_assoc($result);
    }else{
        $hasil['status'] = "205";
        $data = "";
    }
    return $data;
}
function login($un,$ps){
    global $conn, $hasil;
    $query = "SELECT * FROM hantub_user WHERE username='$un'AND password='$ps'";
    $result = mysqli_query($conn,$query);
    if($result->num_rows > 0){
        $hasil['status'] = "200";
        $data = mysqli_fetch_assoc($result);
    }else{
        $hasil['status'] = "205";
        $data = "";
    }
    return $data;
}
function newUser($un,$ps,$em,$pl,$hs){
    global $conn, $hasil;
    $hs = str_replace("'","&qoute1",$hs);
    $pl = str_replace("'","&qoute1",$pl);
    $query = "INSERT INTO hantub_user(username,password,email,playlist,history) VALUES('$un','$ps','$em','$pl','$hs')";
    $result = mysqli_query($conn,$query);
    if($result){
        $hasil['status'] = "200";
        $data = login($un,$ps);
    }else{
        $hasil['status'] = "205";
        $data = "";
    }
    return $data;
}
?>