var conn = require('../database/sql/connectionString');
var jsonSql = require('../database/sql/jsonSql');
var userSql = require('../database/sql/userSql');
var helloFriendsSql = require('../database/sql/helloFriendsSql');
var lootbox = require('../service/lootbox');
var pwyf = require('../service/pwyf');
var cron = require('node-cron');

cron.schedule('0 3 * * * *', function () {
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

                // // 삭제
                // // pwyf.deleteUserJson(row);
                //
                // lootbox.getUsersStats(row).then(function (response) {
                //     console.log("scheduler getUsersStats: " + response);
                //     if (response != undefined && (JSON.parse(response).statusCode == undefined || JSON.parse(response).statusCode == 200)) {
                //         pwyf.deleteUserJsonWithParame(row, "0", "", "");
                //         pwyf.insertUserJson(row, "0", "", response, "");
                //     }
                // });
                //
                // lootbox.getUsersAchievements(row).then(function (response) {
                //     console.log("scheduler getUsersAchievements: " + response);
                //     if (response != undefined && (JSON.parse(response).statusCode == undefined || JSON.parse(response).statusCode == 200)) {
                //         pwyf.deleteUserJsonWithParame(row, "1", "", "");
                //         pwyf.insertUserJson(row, "1", "", response, "");
                //     }
                // });
                //
                // for (var i = 0, cnt = arrMode.length; i < cnt; i++) {
                //     lootbox.getUsersStatsForAllHeroes(row, arrMode[i]).then(function (response) {
                //         console.log("scheduler getUsersStatsForAllHeroes: " + response);
                //         if (response[1] != undefined && (JSON.parse(response[1]).statusCode == undefined || JSON.parse(response[1]).statusCode == 200)) {
                //             pwyf.deleteUserJsonWithParame(row, "2", response[0], "");
                //             pwyf.insertUserJson(row, "2", response[0], response[1], "");
                //         }
                //     });
                // }
                //
                // for (var i = 0, cnt = arrMode.length; i < cnt; i++) {
                //     lootbox.getOverallHeroStats(row, arrMode[i]).then(function (response) {
                //         console.log("scheduler getOverallHeroStats: " + response);
                //         if (response[1] != undefined && (JSON.parse(response[1]).statusCode == undefined || JSON.parse(response[1]).statusCode == 200)) {
                //             pwyf.deleteUserJsonWithParame(row, "3", response[0], "");
                //             pwyf.insertUserJson(row, "3", response[0], response[1], "");
                //             var overalHeroStats = JSON.parse(response[1]);
                //             overalHeroStats.forEach(function (hero) {
                //
                //                 console.log("scheduler getUsersStatsForMultipleHeroes: hero.name" + hero.name);
                //                 lootbox.getUsersStatsForMultipleHeroes(row, response[0], hero.name).then(function (arrResponse) {
                //                     console.log("scheduler getUsersStatsForMultipleHeroes: arrResponse" + arrResponse);
                //
                //                     if (arrResponse[2] != undefined && (JSON.parse(arrResponse[2]).statusCode == undefined || JSON.parse(arrResponse[2]).statusCode == 200)) {
                //                         pwyf.deleteUserJsonWithParame(arrResponse[0], "4", response[1], arrResponse[3]);
                //                         pwyf.insertUserJson(arrResponse[0], "4", arrResponse[1], arrResponse[2], arrResponse[3]);
                //                     }
                //                 });
                //             });
                //         }
                //     });
                // }








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