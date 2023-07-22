<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div class="hasil">
        <?php
        $text = "lilas Ikuta";
        $result1 = htmlentities($text);
        $result2 = html_entity_decode($result1);

        echo "$result1";
        echo "$result2";
        ?>
    </div>
    <script src="./js/jquery-3.6.3.js"></script>
    
   </script>
</body>
</html>