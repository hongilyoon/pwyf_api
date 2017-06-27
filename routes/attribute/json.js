var express = require('express');
var router = express.Router();
var conn = require('../../database/sql/connectionString');
var jsonSql = require('../../database/sql/jsonSql');
var logger = require('../../utils/logger');
var utils = require('util')

router.use(function timeLog(req, res, next) {
    logger.getLogger().info(utils.format('Time: ', Date.now()));
    next();
});

router.get('/specific/:id/:type', function (req, res) {

    var id = req.params.id;
    var type = req.params.type;

    conn.getConnection(function (err, connection) {
        connection.query("select * from json j inner join user u on j.tag = u.tag and u.id = ? and j.type = ?", [id, type], function (err, rows) {
            connection.release();

            // 에러 발생시
            if (err) {
                throw err;
            }

            logger.getLogger().info(utils.format('specific: ', rows));
            res.send(rows);
        });
    });
});

router.get('/specific/friends/:id/:type/:page/:size', function (req, res) {

    var id = req.params.id;
    var type = req.params.type;
    var page = req.params.page;
    var size = req.params.size;
    var result = {};
    var totalCnt = 0;
    logger.getLogger().info(utils.format("id: " + id + ", type: " + type + ", page: " + page + ", size: " + size));
    conn.getConnection(function (err, connection) {
        connection.query(jsonSql.getFriendsAttributesListTotalCount, [id, type, id, type, id], function (err, rows) {
            connection.release();

            // 에러 발생시
            if (err) {
                throw err;
            }

            totalCnt = rows[0].cnt;
            result.totalCnt = totalCnt;
            logger.getLogger().info(utils.format('totalCnt: ', totalCnt));
            if (totalCnt > 0) {

                var sttIdx = Math.floor(((totalCnt / size) * (page - 1)));
                var endIdx = Math.floor(size);

                conn.getConnection(function (err, connection) {
                    connection.query(jsonSql.getFriendsAttributesList, [id, type, id, type, sttIdx, endIdx], function (err, rows) {
                        connection.release();

                        // 에러 발생시
                        if (err) {
                            throw err;
                        }

                        logger.getLogger().info(utils.format('specific: ', rows));
                        result.users = rows;
                        res.send(result);
                    });
                });
            } else {
                res.send(result);
            }
        });
    });
});

module.exports = router;