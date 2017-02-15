var mysql = require("mysql");

var pool = mysql.createPool({
    connectionLimit: 1000,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'pwyf_dev',
    acquireTimeout: 10 * 60 * 1000
});

exports.getConnection = function (callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        callback(err, conn);
    });
};