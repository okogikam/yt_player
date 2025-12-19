<?php
header("Content-Type: application/json;");
//header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

cors();

$url_base = "https://apk.hancau.net/api/yts/";
$result = array(
  "videos"=>array()
);
$hasil = array();

if(isset($_GET['type'])){
    if($_GET['type'] === "homepage"){
        homePage();
        echo json_encode($result);
    }
    if($_GET['type'] === "viewpage"){
        $id = $_GET['v'];
        viewPage($id);
        echo json_encode($result);
    }
    if($_GET['type'] === "search"){
        if(isset($_GET['q'])){
            $q = str_replace(" ","%20",$_GET['q']);
            searchPageApi($q);
        }        
    }
    if($_GET['type'] === "channel"){
        if(isset($_GET['c'])){
            $c = $_GET['c'];
            channelPage($c);
        }
        echo json_encode($result);
    }
    
}else{
        $list_api = array(
          "homepage"=>"$url_base?type=homepage",
          "search"=>"$url_base?type=search&q=tekotok",
          "viewpage"=>"$url_base?type=viewpage&v=YdHDmX_yXYs",
          "channel"=>"$url_base?type=channel&c=@tekotok"
        );
        echo json_encode($list_api);
}

function homePage(){
  $file = file_get_contents("https://www.youtube.com/");
  $json = explode("><",$file);
  $a = explode('var ytInitialData = ',$json[558]);
  $b = str_replace(';</script',"",$a[1]);
  $c = json_decode($b);
  $d = $c->contents->twoColumnBrowseResultsRenderer->tabs;
  $e = $d[0]->tabRenderer->content->richGridRenderer->contents;
  
  for($i=0;$i<count($e);$i++){
        foreach($e[$i] as $key=>$v){
            if($key === "richItemRenderer"){
                $f = (array) $v->content;
                richItemRenderer($f);
            }else if($key === "richSectionRenderer"){
        		$f = (array) $v->content;
        		if(isset($f['richShelfRenderer'])) {
        		    $g = $f['richShelfRenderer'];
        		    richShelfRenderer($g);		
        		}
        	 }
        }
   }
}

function channelPage($chanel){
 global $result;
 $index = array();
 $file = file_get_contents("https://www.youtube.com/$chanel/videos");
 $json = explode("><",$file);
 
 foreach($json as $i=>$string){
  if(str_contains($string,"ytInitialData")){
     array_push($index,$i);
  }
 }
 $id= $index[0];
 $a = explode('var ytInitialData = ',$json[$id]);
 $b = str_replace(';</script',"",$a[1]);
 
 $c = json_decode($b);
 $d = $c->contents->twoColumnBrowseResultsRenderer->tabs[1]->tabRenderer->content->richGridRenderer->contents;

 foreach($d as $e){
  foreach($e as $key=>$f){
    if($key === "richItemRenderer"){
       $g = (array) $f->content->videoRenderer;
       array_push($result['videos'],$g);
    }
  }
 }
}

function viewPage($id){
  global $result;
  $index = array();
  $file = file_get_contents("https://www.youtube.com/watch?v=$id");
  $json = explode("><",$file);
  foreach($json as $i => $string){
      if(str_contains($string,"ytInitialData")){
          array_push($index,$i);
      }
  }
  $file_index = $index[0];
  $a = explode('var ytInitialData = ',$json[$file_index]);
  $b = str_replace(';</script',"",$a[1]);  
 
  $c = json_decode($b);
  $d = (array) $c->contents->twoColumnWatchNextResults;
  $result['next_video'] = array();
  foreach($d as $key=>$v){
    if($key === "results"){
       $e = (array) $v->results->contents ;
       results($e);
    }
    if($key === "secondaryResults"){    
      $e = (array) $v->secondaryResults->results;
      foreach($e as $f){
        foreach($f as $key=>$g){
          if($key === "compactVideoRenderer"){
            array_push($result['next_video'],$g);
          }
        }
      }
    }
  }
}


function searchPage($q){
    global $result;
    $index = array();
   $r = urlencode($q);
 
  $file = file_get_contents("https://www.youtube.com/results?search_query=$r");
  $json = explode("><",$file);
  foreach($json as $i => $string){
      if(str_contains($string,"ytInitialData")){
          array_push($index,$i);
      }
  }
  $file_index = $index[0];
  $a = explode('var ytInitialData = ',$json[$file_index]);
  $b = str_replace(';</script',"",$a[1]); 
  $c = json_decode($b); 
  $d = $c->contents->twoColumnSearchResultsRenderer->primaryContents->sectionListRenderer->contents[0]->itemSectionRenderer->contents;
     foreach($d as $e){
      foreach($e as $key=>$f){
         if($key === "videoRenderer"){
          array_push($result['videos'],$f);
         }
      }
     }
	echo json_encode($result);
}

function searchPageApi($q){
	global $_GET;
    $url = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=$q&key=AIzaSyCHjRJIK4diEwjSvJe1zPgarVhmuItQtZI&type=video";
     
    // if(isset($_GET['type'])){
    //     $type = $_GET['type'];
    //     $url .= "&type=$type";
    // }
    
    if(isset($_GET['maxResults'])){
        $maxResults = $_GET['maxResults'];
        $url .= "&maxResults=$maxResults";
    }
    
    if(isset($_GET['pageToken'])){
        $pageToken = $_GET['pageToken'];
        $url .= "&pageToken=$pageToken";
    }
    
    
    $data = file_get_contents($url);
    echo $data;
}

function richItemRenderer($f){
     global $result;   
     foreach($f as $key=>$v){
       array_push($result['videos'],$v);
     }
     
}

function richShelfRenderer($g){
  global $result;
  $title = $g->title->runs[0]->text;
  $h = $g->contents;
  $result[$title] = array();
  for($i=0;$i<count($h);$i++){ 
    $j = (array) $h[$i]->richItemRenderer->content;
    foreach($j as $key=>$v){
      array_push($result[$title],$v);
    }
  }
  
}

function results($e){
  global $result;
  foreach($e as $f){
       foreach($f as $g){
         foreach($g as $key=>$h){
         $result['videos'][$key] = array();
            array_push($result['videos'][$key],$h);
        }
      }
   }
}
// crossorigin 
function cors() {
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
    
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
        exit(0);
    }
}
?>
