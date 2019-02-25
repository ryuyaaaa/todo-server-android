var express = require('express');
var router = express.Router();
var app = require('./../app');

/*--- /api/usersにGETアクションでアクセスしたときの設定 ---*/
router.get('/', function(req, res) {
    
    var sql = 'select * from chatdb.users where uid = ?';
    app.connection.query(sql, req.header('Uid'), function (error, results, fields) {
        
        if (error) {
            console.log('通信に失敗しました');
            console.log(error);
            var param = {"値":"GETメソッドのリクエストに失敗しました"};
            res.header('Content-Type', 'application/json; charset=utf-8')
                .status(503)
                .send(param);
            console.log(req.body);
        } else {
            console.log('通信に成功しました');
            console.log(results);
            var param = {results};
            res.header('Content-Type', 'application/json; charset=utf-8')
                .status(200)
                .send(param);
        }

    });
});

/*--- /api/usersにPATCHアクションでアクセスしたときの設定 ---*/
router.put('/', function(req, res) {
    
    var sql = 'update users set name = ?, comment = ? where uid = ?';
    app.connection.query(sql, [req.body.name, req.body.comment, req.header('Uid')], function (error, results, fields) {
        
        if (error) {
            console.log('通信に失敗しました');
            console.log(error);
            var param = {"値":"GETメソッドのリクエストに失敗しました"};
            res.header('Content-Type', 'application/json; charset=utf-8')
                .status(503)
                .send(param);
            console.log(req.body);
        } else {
            console.log('通信に成功しました');
            console.log(results);
            var param = {results};
            res.header('Content-Type', 'application/json; charset=utf-8')
                .status(200)
                .send(param);
        }

    });
});

/*--- /api/users/signupにPOSTアクションでアクセスしたときの設定 ---*/
router.post('/signup', function(req, res) {

    var sql = 'select * from chatdb.users where uid = ?';
    app.connection.query(sql, req.body.uid, function (error, results, fields) {
        
        if (results == '') {
            console.log('新規登録可能');

            // 新規登録可能であるとき
            sql = 'insert into chatdb.users set ?';
            var data = {uid:req.body.uid, email:req.body.email, password:req.body.password};
            app.connection.query(sql, data, function(error, results, fields) {

                if (error) {
                    console.log('通信が失敗しました');

                    var param = {"値":"POSTメソッドのリクエストに失敗しました"};
                    res.header('Content-Type', 'application/json; charset=utf-8')
                        .status(422)
                        .send(param);
                    console.log(req.body);
                } else {
                    console.log('通信が成功しました');
                    var param = {"uid":req.body.uid};
                    res.header('Content-Type', 'application/json; charset=utf-8')
                        .status(200)
                        .send(param);
                    console.log(results);
                }
            });

        } else {
            console.log('uidが既に存在');
            console.log(results);

            var param = {"値":"POSTメソッドのリクエストに失敗しました"};
            res.header('Content-Type', 'application/json; charset=utf-8')
                .status(422)
                .send(param);
            console.log(req.body);
        }
    });
});

/*--- /api/users/loginにPOSTアクションでアクセスしたときの設定 ---*/
router.post('/login', function(req, res) {

    var sql = 'select * from chatdb.users where email = ? and password = ?';
    app.connection.query(sql, [req.body.email, req.body.password], function (error, results, fields) {
        
        if (results == '') {
            console.log('データが存在しません');

            var param = {"値":"POSTメソッドのリクエストに失敗しました"};
            res.header('Content-Type', 'application/json; charset=utf-8')
                .status(401)
                .send(param);
            console.log(req.body);

        } else {
            // ログイン可能
            console.log('ログイン可能');
            console.log(results);

            var param = {"値":"POSTメソッドのリクエストに成功しました"};
            res.header('Content-Type', 'application/json; charset=utf-8')
                .status(200)
                .send(param);
            console.log(req.body);
        }
    });
});

//routerをモジュールとして扱う準備
module.exports = router;