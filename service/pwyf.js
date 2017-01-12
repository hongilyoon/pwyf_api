var conn = require('../database/sql/connectionString');
var jsonSql = require('../database/sql/jsonSql');
var userSql = require('../database/sql/userSql');

exports.deleteUserJson =  function (row) {
    console.log("db delete user josn string. row: " + row.jsonSeq);

    conn.getConnection(function (err, connection) {
        connection.query(jsonSql.deleteUserJson, [row.seq], function (err, rows) {
            // 에러 발생시
            if (err) {
                console.log("deleteUserJson error: " + err.toString());
                connection.release();
                throw err;
            }
            console.log("delete success");
            connection.release();
        });
    });
}

exports.insertUserJson = function (row, type, subtype, response, heroname) {
    console.log("db insert string. \nrow: " + row.seq + " \ntype: " + type + " \nsubtype: " + subtype + " \nresponse: " + response + " \nheroname: " + heroname);
    // 대상 명단 조회(PWYF)
    conn.getConnection(function (err, connection) {
        connection.query(jsonSql.insertUserJson, [row.seq, type, subtype, heroname, response], function (err, rows) {
            // 에러 발생시
            if (err) {
                console.log("insertUserJson error: " + err.toString());
                connection.release();
                throw err;
            }
            console.log("insert success");
            connection.release();
        });
    });
}

exports.updateUserJson = function (row, type, response) {
    console.log("db insert string. row: " + row.seq + " response: " + response);
    console.log("UPDATE json SET json = " + response + ", mod_date = NOW() WHERE seq = " + row.seq+ " AND type = " + 2);
    // 대상 명단 조회(PWYF)
    conn.getConnection(function (err, connection) {
        connection.query("UPDATE json SET json = ?, mod_date = NOW() WHERE seq = ? AND type = ?", [response, row.seq, type], function (err, rows) {
            // 에러 발생시
            if (err) {
                console.log("updateUserJson error: " + err.toString());
                connection.release();
                throw err;
            }
            console.log("update success");
            connection.release();
        });
    });
}

exports.updateUserJsonWithRegionAndPlatform = function (row, type, response) {
    console.log("db insert string. row: " + row + " response: " + response);
    // 대상 명단 조회(PWYF)
    conn.getConnection(function (err, connection) {
        connection.query("UPDATE json SET json = ?, mod_date = NOW() WHERE seq = ? AND type = ?", [response, row.jsonSeq, type], function (err, rows) {
            // 에러 발생시
            if (err) {
                connection.release();
                throw err;
            }
            console.log("update success");
            connection.release();
        });
    });
}

exports.getRegionInfo = function (seq, callback) {

    conn.getConnection(function (err, connection) {
        connection.query("SELECT * from region where seq = ?", [seq], function (err, rows) {
            // 에러 발생시
            if (err) {
                connection.release();
                callback(err, null);
            }

            connection.release();
            callback(null, rows[0]);
        });
    });
}

exports.getPlatformInfo = function (seq, callback) {

    conn.getConnection(function (err, connection) {
        connection.query("SELECT * from platform where seq = ?", [seq], function (err, rows) {
            // 에러 발생시
            if (err) {
                callback(err, null);
                connection.release();
            }

            connection.release();
            callback(null, rows[0]);
        });
    });
}