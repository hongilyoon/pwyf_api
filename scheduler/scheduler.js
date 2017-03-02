var conn = require('../database/sql/connectionString');
var jsonSql = require('../database/sql/jsonSql');
var userSql = require('../database/sql/userSql');
var helloFriendsSql = require('../database/sql/helloFriendsSql');
var pwyf = require('../service/pwyf');
var cron = require('node-cron');

cron.schedule('0 */3 * * * *', function () {
    console.log('info', 'running a task of updating saveUsersStats every time. ' + new Date());

    // 1일 동안 업데이트 안된 대상 명단 조회
    conn.getConnection(function (err, connection) {
        connection.query(jsonSql.selectTagListForUpdate, ["0", "", ""], function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
                connection.release();
            }
            connection.release();

            // 조회(LOOT_BOX_API)
            rows.forEach(function (row) {
                console.log("scheduler selectTagListForUpdate user tag: " + row.tag);

                // 능력치를 저장합니다.
                pwyf.saveUsersStats(row);
            });
        });
    });
}).start();

cron.schedule('10 */3 * * *', function () {
    console.log('info', 'running a task of updating saveUsersAchievements every time. ' + new Date());

    // 1일 동안 업데이트 안된 대상 명단 조회
    conn.getConnection(function (err, connection) {
        connection.query(jsonSql.selectTagListForUpdate, ["1", "", ""], function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
                connection.release();
            }
            connection.release();

            // 조회(LOOT_BOX_API)
            rows.forEach(function (row) {
                console.log("scheduler selectTagListForUpdate user tag: " + row.tag);

                // 능력치를 저장합니다.
                pwyf.saveUsersAchievements(row);
            });
        });
    });
}).start();

cron.schedule('20 */3 * * *', function () {
    console.log('info', 'running a task of updating saveUsersStatsForAllHeroes every time. ' + new Date());

    // 1일 동안 업데이트 안된 대상 명단 조회
    conn.getConnection(function (err, connection) {
        connection.query(jsonSql.selectTagListForUpdate, ["2", "", ""], function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
                connection.release();
            }
            connection.release();

            // 조회(LOOT_BOX_API)
            rows.forEach(function (row) {
                console.log("scheduler selectTagListForUpdate user tag: " + row.tag);

                // 능력치를 저장합니다.
                pwyf.saveUsersStatsForAllHeroes(row);
            });
        });
    });
}).start();

cron.schedule('30 */3 * * *', function () {
    console.log('info', 'running a task of updating saveOverallHeroStats every time. ' + new Date());

    // 1일 동안 업데이트 안된 대상 명단 조회
    conn.getConnection(function (err, connection) {
        connection.query(jsonSql.selectTagListForUpdate, ["3", "", ""], function (err, rows) {

            // 에러 발생시
            if (err) {
                throw err;
                connection.release();
            }
            connection.release();

            // 조회(LOOT_BOX_API)
            rows.forEach(function (row) {
                console.log("scheduler selectTagListForUpdate user tag: " + row.tag);

                // 능력치를 저장합니다.
                pwyf.saveOverallHeroStats(row);
            });
        });
    });
}).start();

cron.schedule('40 */3 * * *', function () {
    console.log('info', 'running a task of updating getUsersStatsForMultipleHeroes every time. ' + new Date());

    // 1일 동안 업데이트 안된 대상 명단 조회
    conn.getConnection(function (err, connection) {
        connection.query(jsonSql.selectAllHeroList, ["", ""], function (err, rows) {
            connection.release();

            // 에러 발생시
            if (err) {
                throw err;
            }

            var list = new Array();

            if (rows != null && rows.length > 0) {
                rows.forEach(function (row) {
                    if (row.json != null) {
                        var idx = 0;
                        JSON.parse(row.json).forEach(function (hero) {
                            list.push({
                                idx: idx++,
                                tag: row.tag,
                                subtype: row.subtype,
                                heroName: hero.name,
                                platformName: row.platformName,
                                regionName: row.regionName
                            });
                        });
                    }
                });
            }

            for (var i = 0, cnt = list.length / 10; i < cnt; i++ ) {
                var sttIdx = i * 10;
                var endIdx = i < cnt - 1 ? (i + 1) * 10 : list.length;
                var sliceList = list.slice(sttIdx, endIdx);
                setTimeout(function (sliceList) {
                    sliceList.forEach(function(result) {
                        // console.log(" result: " + result.idx, + " tag: " + result.tag + " subtype: " + result.subtype + " heroName" + result.heroName);
                        pwyf.getUsersStatsForMultipleHeroes(result);
                    });
                }, i * 60 * 1000, sliceList);
            }
        });
    });
}).start();

cron.schedule('0 */10 * * * *', function () {
    console.log('info', 'running a task of updating hello friends list every time. ' + new Date());

    // 친구 목록 업데이트
    conn.getConnection(function (err, connection) {
        connection.query(helloFriendsSql.insertHelloFriendsList, function (err, rows) {
            connection.release();

            // 에러 발생시
            if (err) {
                throw err;
            }

            console.log("updating facebook friends list: " + rows);
        });
    });
}).start();