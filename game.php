<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>game | node.jsとexpressで作ったリアルタイムチャット</title>
<script src="/socket.io/socket.io.js"></script>
<script src="//code.jquery.com/jquery-1.11.1.js"></script>
</head>
<body>
  <?php echo 'ようこそ！'; 
  echo '<a href="/">home</a>';
  ?>
  <div id="info">
    <div id="user_name">あなたのID&nbsp;:&nbsp;<p></p></div>
    <div id="user_cnt">アクティブユーザ&nbsp;:&nbsp;<p></p></div>
  </div>
  <ul id="message"></ul>
  <div id="controls">
    <form action="">
    <select name="channel" id="channel">
      <option value="A">チャンネルA</option>
      <option value="B">チャンネルB</option>
    </select>
    <input type="text" id="msj" placeholder="メッセージを入力してください...">
    <input type="submit" id="btn" value="送信">
    </form> 
 </div>
</body>
</html>