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
}else{
    $hasil['status'] = "200";
    $hasil['result'] = getData();
}

echo json_encode($hasil);

function getData(){
    global $conn;
    $query = "SELECT * FROM hantub";
    $result = mysqli_query($conn,$query);
    $data = mysqli_fetch_assoc($result);
    return $data;
}
?>