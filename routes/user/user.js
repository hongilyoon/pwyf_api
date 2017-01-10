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
            }

            console.log('user list: ', rows);
            res.send(rows);
        });
    });
});

router.get('/list', function (req, res) {

    conn.getConnection(function (err, connection) {
        connection.query(userSql.getUserListByDelYn, function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
            }

            console.log('user list: ', rows);
            res.send(rows);
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
            }

            // 기존 사용자가 존재하는 경우 Update, 존재하지 않는 경우 Insert
            if (rows.length > 0) {
                console.log("존재함");

                connection.query(userSql.updateUserInfo, [name, platformSeq,
                    regionSeq, tag, id], function (err, rows) {

                    // 에러 발생시
                    if (err) {
                        throw err;
                    }

                    updateJson(req.body);
                    res.sendStatus(200);
                });
            } else {
                connection.query(userSql.insertUserInfo, [name, id,
                    platformSeq, regionSeq, tag, 'N'], function (err,
                                                                 rows) {

                    // 에러 발생시
                    if (err) {
                        throw err;
                    }

                    updateJson(req.body);
                    res.sendStatus(200);
                });
            }
        });
    });
});

updateJson = function (param) {

    async.waterfall([
        function (callback) {
            pwyf.getPlatformInfo(param.platformSeq, function (err, data) {
                // 에러 발생시
                if (err) {
                    callback(err);
                }

                // 정상 조회
                callback(null, data.name);
            })
        },
        function (platformName, callback) {
            pwyf.getRegionInfo(param.regionSeq, function (err, data) {
                // 에러 발생시
                if (err) {
                    callback(err);
                }

                // 정상 조회
                callback(null, platformName, data.name);
            })
        },
        function (platformName, regionName, callback) {

            // log
            console.log("platformName: " + platformName);
            console.log("regionName: " + regionName);

            // set param
            param.platformName = platformName;
            param.regionName = regionName;
            console.log("param tag: " + param.tag);

            // 능력치 저장
            lootbox.getUsersStats(param).then(function (response) {
                console.log("scheduler getUsersStats: " + response);
                pwyf.updateUserJson(param, "1", response);
            });

            // 성과 저장
            lootbox.getUsersAchievements(param).then(function (response) {
                console.log("scheduler getUsersAchievements: " + response);
                pwyf.updateUserJson(param, "0", response);
            });

            callback(null);
        }
    ], function (err) {
        if (err) {
            console.log("err: " + err);
        } else {
            console.log("success");
        }
    });
}

module.exports = router;