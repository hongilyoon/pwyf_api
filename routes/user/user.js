var express = require('express');
var async = require('async');
var conn = require('../../database/sql/connectionString');
var userSql = require('../../database/sql/userSql');
var lootbox = require('../../service/lootbox');
var pwyf = require('../../service/pwyf');
var router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/:id', function (req, res) {

    conn.getConnection(function (err, connection) {
        connection.query(userSql.getUserListById, req.params.id, function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
                connection.release();
            }

            console.log('user list: ', rows);
            res.send(rows);
            connection.release();
        });
    });
});

router.get('/list', function (req, res) {

    conn.getConnection(function (err, connection) {
        connection.query(userSql.getUserListByDelYn, function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
                connection.release();
            }

            console.log('user list: ', rows);
            res.send(rows);
            connection.release();
        });
    });
});

router.post("/save", function (req, res) {

    var name = req.body.name;
    var id = req.body.id;
    var platformSeq = req.body.platformSeq;
    var regionSeq = req.body.regionSeq;
    var tag = req.body.tag = req.body.tag.replace('#', '-');

    conn.getConnection(function (err, connection) {
        connection.query(userSql.getUserListById, [id], function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
                connection.release();
            }

            // 기존 사용자가 존재하는 경우 Update, 존재하지 않는 경우 Insert
            if (rows.length > 0) {
                console.log("존재함");

                connection.query(userSql.updateUserInfo, [name, platformSeq,
                    regionSeq, tag, id], function (err, rows) {

                    // 에러 발생시
                    if (err) {
                        throw err;
                        connection.release();
                    }

                    // updateJson(req.body);
                    res.sendStatus(200);
                    connection.query(userSql.getUpdateUser, [id], function (err, row) {

                        // 에러 발생시
                        if (err) {
                            throw err;
                            connection.release();
                        }

                        pwyf.saveUserJson(row[0]);
                        connection.release();
                    });
                });
            } else {
                connection.query(userSql.insertUserInfo, [name, id,
                    platformSeq, regionSeq, tag, 'N'], function (err, rows) {

                    // 에러 발생시
                    if (err) {
                        throw err;
                        connection.release();
                    }

                    res.sendStatus(200);
                    connection.query(userSql.getUpdateUser, [id], function (err, row) {

                        // 에러 발생시
                        if (err) {
                            throw err;
                            connection.release();
                        }

                        pwyf.saveUserJson(row[0]);
                        connection.release();
                    });
                });
            }
        });
    });
});

router.get('/last-update-date/:id', function (req, res) {

    conn.getConnection(function (err, connection) {
        connection.query(userSql.getUserJsonLastUpdateDate, req.params.id, function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
                connection.release();
            }

            console.log('user list: ', rows);
            if (rows != undefined && rows.length > 0) {
                res.send(rows[0]);
            }
            else {
                res.send(null);
            }
            connection.release();
        });
    });
});

module.exports = router;