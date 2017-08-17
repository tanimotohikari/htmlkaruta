var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var POST = process.env.PORT || 8080;
var userCnt = {
    a : 0,
    b : 0
  }

//ルートディレクトリにアクセスした時に動く処理
app.get('/', function(req, res) {
  //index.htmlに遷移する
  res.sendFile(__dirname + '/index.html');
});

//socket.ioに接続された時に動く処理
io.on('connection', function(socket) {
  //接続時に振られた一意のIDをコンソールに表示
  console.log('%s さんが接続しました。', socket.id);
  
  var channel = 'A';//デフォルトのチャンネル
  socket.join(channel);//Roomを初期化するらしい
  userCnt.a++;//アクセス時はデフォルトのチャンネルなので、そのユーザをカウント
  io.emit('userChannel', userCnt);//全ユーザ上のユーザ数を更新
  
  //「ようこそ」と「ID」を自分の画面だけに表示
  socket.emit('welcome');
  socket.emit('getId', socket.id);
  
  //接続時に同じチャンネルの人に入室を伝える
  socket.broadcast.to(channel).emit('message', socket.id + 'さんが入室しました！', 'system'); 
  
  //messageイベントで動く
  //同じチャンネルの人にメッセージを送る
  socket.on('message', function(msj) {
    io.sockets.in(channel).emit('message', msj, socket.id);
  });
  
  //接続が切れた時に動く
  //接続が切れたIDを全員に表示
  socket.on('disconnect', function(e) {
    console.log('%s さんが退室しました。', socket.id);
    if (channel === 'A') {
      userCnt.a--;
  
    } else {
      userCnt.b--;
    }
    //アクティブユーザを更新
    io.emit('userChannel', userCnt);
  });
  
  //チャンネルを変えた時に動く
  //今いるチャンネルを出て、選択されたチャンネルに移動する
  socket.on('changeChannel', function(newChannel) {
    socket.broadcast.to(channel).emit('message', socket.id + 'さんが退室しました！', 'system');//ルーム内の自分以外
    if (newChannel === 'A') {
      ++userCnt.a;
      if (userCnt.b > 0) {
        --userCnt.b;
      }
    } else {
      ++userCnt.b;
      if (userCnt.a > 0) {
        --userCnt.a;
      }
    }
    io.emit('userChannel', userCnt);
    socket.leave(channel); //チャンネルを去る
    socket.join(newChannel); //選択された新しいチャンネルのルームに入る
    channel = newChannel; //今いるチャンネルを保存
    socket.emit('changeChannel', channel); //チャンネルを変えたこと自分に送信
    socket.broadcast.to(channel).emit('message', socket.id + 'さんが入室しました！', 'system');//ルーム内の自分以外
  });

  //かるたがクリックされた時の処理
  socket.on('emitFromClient', function(data) {
    io.sockets.emit('emitFromServer', data.select);
    socket.emit('emitFromServer', data);
    socket.broadcast.emit('emitFromServer', data.select);
  });
});

//接続待ち状態になる
http.listen(POST, function() {
  console.log('接続開始：', POST);
});