var conn = require('../database/sql/connectionString');
var jsonSql = require('../database/sql/jsonSql');
var userSql = require('../database/sql/userSql');
var helloFriendsSql = require('../database/sql/helloFriendsSql');
var lootbox = require('../service/lootbox');
var pwyf = require('../service/pwyf');
var cron = require('node-cron');

cron.schedule('0 */2 * * * *', function () {
    console.log('info', 'running a task of updating user stats every time. ' + new Date());

    // 1일 동안 업데이트 안된 대상 명단 조회
    conn.getConnection(function (err, connection) {
        connection.query(userSql.getUpdateUserList, function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
                connection.release();
            }
            connection.release();

            // 조회(LOOT_BOX_API)
            rows.forEach(function (row) {
                console.log("updated user info" + row.seq);

                // 능력치를 저장합니다.
                pwyf.saveUserJson(row);
            });
        });
    });
}).start();

cron.schedule('30 0 * * * *', function () {
    console.log('info', 'running a task of updating hello friends list every time. ' + new Date());
    console.log("helloFriendsSql.insertHelloFriendsList: " + helloFriendsSql.insertHelloFriendsList);

    // 1일 동안 업데이트 안된 대상 명단 조회
    conn.getConnection(function (err, connection) {
        connection.query(helloFriendsSql.insertHelloFriendsList, function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
                connection.release();
            }

            console.log("updating facebook friends list: " + rows);
            connection.release();
        });
    });
}).start();