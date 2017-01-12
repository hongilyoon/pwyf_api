var conn = require('../database/sql/connectionString');
var jsonSql = require('../database/sql/jsonSql');
var userSql = require('../database/sql/userSql');
var helloFriendsSql = require('../database/sql/helloFriendsSql');
var lootbox = require('../service/lootbox');
var pwyf = require('../service/pwyf');
var cron = require('node-cron');

var arrMode = ["competitive", "quickplay"];

cron.schedule('0 0 * * * *', function () {
    console.log('info', 'running a task of updating user stats every time. ' + new Date());

    // 1일 동안 업데이트 안된 대상 명단 조회
    conn.getConnection(function (err, connection) {
        connection.query(userSql.getNotUpdatedUser, function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
                connection.release();
            }

            // 조회(LOOT_BOX_API)
            rows.forEach(function (row) {
                console.log("updated user info" + row.seq);

                // 삭제
                pwyf.deleteUserJson(row);

                lootbox.getUsersAchievements(row).then(function (response) {
                    console.log("scheduler getUsersAchievements: " + response);
                    pwyf.insertUserJson(row, "0", "", response, "");
                });
                lootbox.getUsersStats(row).then(function (response) {
                    console.log("scheduler getUsersStats: " + response);
                    pwyf.insertUserJson(row, "1", "", response, "");
                });
                for (var i = 0, cnt = arrMode.length; i < cnt; i++) {
                    lootbox.getUsersStatsForAllHeroes(row, arrMode[i]).then(function (response) {
                        console.log("scheduler getUsersStatsForAllHeroes: " + response);
                        pwyf.insertUserJson(row, "2", response[0], response[1], "");
                    });
                }
                for (var i = 0, cnt = arrMode.length; i < cnt; i++) {
                    lootbox.getOverallHeroStats(row, arrMode[i]).then(function (response) {
                        console.log("scheduler getOverallHeroStatsUrl: " + response);
                        pwyf.insertUserJson(row, "3", response[0], response[1], "");

                        var overalHeroStats = JSON.parse(response[1]);
                        overalHeroStats.forEach(function(hero) {
                            console.log("scheduler overalHeroStats hero name: " + hero.name);
                            for (var j = 0, cnt = arrMode.length; j < cnt; j++) {
                                lootbox.getUsersStatsForMultipleHeroes(row, arrMode[j], hero.name).then(function (response2) {
                                    console.log("scheduler getUsersStatsForAllHeroes: " + response);
                                    pwyf.insertUserJson(row, "4", response2[0], response2[1], hero.name);
                                });
                            }
                        });
                    });
                }
            });

            connection.release();
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