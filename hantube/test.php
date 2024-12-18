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
    $un = $_GET['un'];
    $ps = $_GET['ps'];  
    switch($_GET['type']){
        case "2":
            $pl = $_GET['pl'];
            $em = $_GET['em'];
            $hs = $_GET['hs'];
            newUser($un,$ps,$em,$pl,$hs);
            break;
        default :
            $hasil['result'] = getData($un,$ps);
            break; 
    }  
}else{
    $hasil['status'] = "300";
}

echo json_encode($hasil);

function getData($un,$ps){
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
    $query = "INSERT INTO hantub_user(username,password,email,playlist,history) VALUES('$un','$ps','$em','$pl','$hs')";
    $result = mysqli_query($conn,$query);
    if($result){
        $hasil['status'] = "200";
        $data = $result;
    }else{
        $hasil['status'] = "205";
        $data = "";
    }
    return $data;
}
?>