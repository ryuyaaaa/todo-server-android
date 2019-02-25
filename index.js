// モジュール読み込み
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var mysql = require('mysql');
var bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080;

// mysqlの設定
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tododb'
});

// mysqlに接続
connection.connect(function(err) {
    if (err) {
        console.error('error:connecting: ' + err);
        return;
    }
    console.log('mysql: connected as id ' + connection.threadId);
});

// body-parserの設定
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// routerの設定
var router = require('./routes/index');
app.use('/api', router);

// サーバを立てる
app.listen(PORT);

app.get('/', function(req, res) {
    console.log('get access');
});

console.log('listen on port ' + PORT);

io.sockets.on('connection', function(socket) {

    // 投稿時の操作
    socket.on('send', function(data) {
        var data = {value: data.value};
        io.sockets.emit('send', data);
    });

});

exports.connection = connection;