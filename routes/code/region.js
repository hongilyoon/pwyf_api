var express = require('express');
var router = express.Router();
var conn = require('../../database/sql/connectionString');
var logger = require('../../utils/logger');
var utils = require('util')

router.use(function timeLog(req, res, next) {
    logger.getLogger().info(utils.format('Time: ', Date.now()));
    next();
});

router.get('/', function (req, res) {
    res.send('Region API');
});

router.get('/list', function (req, res) {
    conn.getConnection(function (err, connection) {
        connection.query('SELECT * from region', function (err, rows) {
            connection.release();

            // 에러 발생시
            if (err) {
                throw err;
            }

            res.send(rows);
        });
    });
});

module.exports = router;