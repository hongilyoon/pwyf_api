var express = require('express');
var router = express.Router();
var conn = require('../../database/connectionString');
var jsonSql = require('../../database/jsonSql');

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/specific/:id/:type', function (req, res) {

    var id = req.params.id;
    var type = req.params.type;

    conn.getConnection(function (err, connection) {
        connection.query("select * from json j inner join user u on j.user_seq = u.seq and u.id = ? and j.type = ?",
            [id, type],
            function (err, rows) {

                // 에러 발생시
                if (err) {
                    throw err;
                }

                console.log('specific: ', rows);
                res.send(rows);
            });
    });
});

router.get('/specific/friends/:id/:type', function (req, res) {

    var id = req.params.id;
    var type = req.params.type;

    console.log("id: " + id + ", type: " + type);

    conn.getConnection(function (err, connection) {
        connection.query("select h.friends_seq, j.json from hello_friends h inner join user u on h.user_seq = u.seq inner join json j on h.friends_seq = j.user_seq where u.id = ? and j.type = ?", [id, type], function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
            }

            console.log('specific: ', rows);
            res.send(rows);
        });
    });
});

router.get('/specific/friends/:id/:type/:page/:size', function (req, res) {

    var id = req.params.id;
    var type = req.params.type;
    var page = req.params.page;
    var size = req.params.size;

    console.log("id: " + id + ", type: " + type + ", page: " + page + ", size: " + size);

    var result = {};
    var totalCnt = 0;
    conn.getConnection(function (err, connection) {
        connection.query(jsonSql.getFriendsAttributesListTotalCount, [id, type, id, type, id], function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
            }

            totalCnt = rows[0].cnt;
            result.totalCnt = totalCnt;
            console.log('totalCnt: ', totalCnt);

            if (totalCnt > 0) {

                var sttIdx = Math.floor(((totalCnt / size) * (page - 1)));
                var endIdx = Math.floor(size);

                connection.query(jsonSql.getFriendsAttributesList, [id, type, id, type, id, sttIdx, endIdx], function (err, rows) {

                    // 에러 발생시
                    if (err) {
                        throw err;
                    }

                    console.log('specific: ', rows);
                    result.users = rows;
                    res.send(result);
                });
            } else {
                res.send(result);
            }
        });
    });
});

module.exports = router;