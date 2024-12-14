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
}else if(isset($_GET['un']) && isset($_GET['ps'])){
    $un = $_GET['un'];
    $ps = $_GET['ps'];    
    $hasil['result'] = getData($un,$ps);
}else{
    $hasil['status'] = "300";
}

echo json_encode($hasil);

function getData($un,$ps){
    global $conn, $hasil;
    $query = "SELECT * FROM hantub WHERE username='$un'AND password='$ps'";
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
?>