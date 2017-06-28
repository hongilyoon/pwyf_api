var express = require('express');
var async = require('async');
var conn = require('../../database/sql/connectionString');
var userSql = require('../../database/sql/userSql');
var lootbox = require('../../service/lootbox');
var playoverwatch = require('../../service/playoverwatch');
var pwyf = require('../../service/pwyf');
var logger = require('../../utils/logger');
var utils = require('util')
var router = express.Router();

router.use(function timeLog(req, res, next) {
    logger.getLogger().info(utils.format('Time: ', Date.now()));
    next();
});

router.get('/:id', function (req, res) {

    conn.getConnection(function (err, connection) {
        connection.query(userSql.getUserListById, req.params.id, function (err, rows) {
            connection.release();

            // 에러 발생시
            if (err) {
                logger.getLogger().error(err);
                throw err;
            }

            res.send(rows);
        });
    });
});

router.get('/list', function (req, res) {

    conn.getConnection(function (err, connection) {
        connection.query(userSql.getUserListByDelYn, function (err, rows) {
            connection.release();

            // 에러 발생시
            if (err) {
                throw err;
            }

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
            connection.release();

            // 에러 발생시
            if (err) {
                throw err;
            }

            // 기존 사용자가 존재하는 경우 Update, 존재하지 않는 경우 Insert
            if (rows.length > 0) {
                conn.getConnection(function (err, connection) {
                    connection.query(userSql.updateUserInfo, [name, platformSeq, regionSeq, tag, id], function (err, rows) {
                        connection.release();

                        // 에러 발생시
                        if (err) {
                            logger.getLogger().error(err);
                            throw err;
                        }

                        res.sendStatus(200);
                        pwyf.saveUserJson(id);
                    });
                });
            } else {
                conn.getConnection(function (err, connection) {
                    connection.query(userSql.insertUserInfo, [name, id,
                        platformSeq, regionSeq, tag, 'N'], function (err, rows) {
                        connection.release();

                        // 에러 발생시
                        if (err) {
                            logger.getLogger().error(err);
                            throw err;
                        }

                        res.sendStatus(200);
                        pwyf.saveUserJson(id);
                    });
                });
            }
        });
    });
});

router.get('/last-update-date/:id', function (req, res) {

    conn.getConnection(function (err, connection) {
        connection.query(userSql.getUserJsonLastUpdateDate, req.params.id, function (err, rows) {
            connection.release();

            // 에러 발생시
            if (err) {
                throw err;
            }

            if (rows != undefined && rows.length > 0) {
                res.send(rows[0]);
            }
            else {
                res.send(null);
            }
        });
    });
});

router.get('/playoverwatch/:tagId', function (req, res) {
    var result = playoverwatch.getUser(req.params.tagId).then(function (result) {
        res.contentType('application/json');
        res.send(JSON.stringify(result));
    });
});

router.get('/playoverwatch/main/:type/:tagId', function (req, res) {
    var result = playoverwatch.getMainStatistics(req.params.type, req.params.tagId).then(function (result) {
        res.contentType('application/json');
        res.send(JSON.stringify(result));
    });
});

router.get('/playoverwatch/heroes/:type/:tagId', function (req, res) {
    var result = playoverwatch.getHeroesStatistics(req.params.type, req.params.tagId).then(function (result) {
        res.contentType('application/json');
        res.send(JSON.stringify(result));
    });
});

router.get('/playoverwatch/total/:type/:tagId', function (req, res) {
    var result = playoverwatch.getTotalStatistics(req.params.type, req.params.tagId).then(function (result) {
        res.contentType('application/json');
        res.send(JSON.stringify(result));
    });
});

module.exports = router;