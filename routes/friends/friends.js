var express = require('express');
var async = require('async');
var conn = require('../../database/sql/connectionString');
var helloFriendsSql = require('../../database/sql/helloFriendsSql');
var logger = require('../../utils/logger');
var utils = require('util')
var router = express.Router();

router.use(function timeLog(req, res, next) {
    logger.getLogger().info(utils.format('Time: ', Date.now()));
    next();
});

// 페이스북 친구 목록을 등록합니다.
router.post("/save", function (req, res) {

    var userSeq = req.body.userSeq;
    var friends = req.body.friends;
    async.waterfall([
        function (callback) {

            // 해당 user Seq의 Facebook 친구 목록을 조회합니다.
            conn.getConnection(function (err, connection) {
                connection.query("select friends_id as friendsId from facebook_friends where user_seq = ?", [userSeq], function (err, rows) {
                    connection.release();

                    // 에러 발생시
                    if (err) {
                        callback(err);
                    }

                    // 정상 조회
                    callback(null, rows);
                });
            });
        },
        function (rows, callback) {

            // 조회한 친구목록과 등록하고자하는 친구목록을 비교하여 이미 있는 친구목록은 삭제합니다.
            for (var i = friends.length - 1; i >= 0; i--) {
                logger.getLogger().info(utils.format("facebook save. input all friendId: " + friends[i].id + ", friendName: " + friends[i].name));
                for (var j = 0; j < rows.length; j++) {
                    if (friends[i].id == rows[j].friendsId) {
                        logger.getLogger().info(utils.format("facebook save. slice friendId: " + friends[i].id + ", friendName: " + friends[i].name));
                        friends.splice(i, 1);
                        break;
                    }
                }
            }

            if (friends.length > 0) {
                var arrParam = [];
                friends.forEach(function (friend) {
                    logger.getLogger().info(utils.format("facebook add user. userSeq: " + userSeq + ", friend.id: " + friend.id + ", friend.name: " + friend.name));
                    arrParam.push([userSeq, friend.id, friend.name]);
                });

                conn.getConnection(function (err, connection) {
                    connection.query("insert into facebook_friends (user_seq, friends_id, friends_name) VALUES ?", [arrParam], function (err, rows) {
                        connection.release();

                        // 에러 발생시
                        if (err) {
                            callback(err);
                        }

                        // 정상 조회
                        // 친구 목록 업데이트
                        conn.getConnection(function (err, connection) {
                            connection.query(helloFriendsSql.insertHelloFriendsList, function (err, rows) {
                                connection.release();

                                // 에러 발생시
                                if (err) {
                                    callback(err);
                                }

                                // 정상 조회
                                logger.getLogger().info(utils.format("updating facebook friends list: " + rows));
                                callback(null);
                            });
                        });
                    });
                });
            } else {
                logger.getLogger().info("already saved your friends list.");
                callback(null);
            }
        }], function (err) {
        if (err) {
            logger.getLogger().info(utils.format("err: " + err));
            res.send(err);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;