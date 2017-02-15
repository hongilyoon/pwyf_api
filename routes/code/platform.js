var express = require('express');
var router = express.Router();
var conn = require('../../database/sql/connectionString');

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', function (req, res) {
    res.send('Platform API');
});

router.get('/list', function (req, res) {

    console.log("get user list");
    conn.getConnection(function (err, connection) {
        connection.query('SELECT * from platform', function (err, rows) {
            connection.release();

            // 에러 발생시
            if (err) {
                throw err;
            }

            console.log('user list: ', rows);
            res.send(rows);
        });
    });
});

module.exports = router;