var conn = require('../database/sql/connectionString');
var jsonSql = require('../database/sql/jsonSql');
var userSql = require('../database/sql/userSql');
var helloFriendsSql = require('../database/sql/helloFriendsSql');
var pwyf = require('../service/pwyf');
var logger = require('../utils/logger');
var utils = require('util')
var cron = require('node-cron');

// cron.schedule('*/5 * * * * *', function () {
//
//     logger.getLogger().info(utils.format('running a task of updating saveUsersStats every time. ' + new Date()));
//
//     // 1일 동안 업데이트 안된 대상 명단 조회
//     conn.getConnection(function (err, connection) {
//         connection.query(jsonSql.selectTagListForUpdate, ["0", "", ""], function (err, rows) {
//
//             // 에러 발생시
//             if (err) {
//                 throw err;
//                 connection.release();
//             }
//             connection.release();
//
//             // 조회(LOOT_BOX_API)
//             rows.forEach(function (row) {
//                 logger.getLogger().info(utils.format("scheduler saveUsersStats user tag: " + row.tag));
//
//                 // 능력치를 저장합니다.
//                 pwyf.saveUsersStats(row);
//             });
//         });
//     });
// }).start();
//
// cron.schedule('10 */3 * * *', function () {
//
//     logger.getLogger().info(utils.format('running a task of updating saveUsersAchievements every time. ' + new Date()));
//
//     // 1일 동안 업데이트 안된 대상 명단 조회
//     conn.getConnection(function (err, connection) {
//         connection.query(jsonSql.selectTagListForUpdate, ["1", "", ""], function (err, rows) {
//
//             // 에러 발생시
//             if (err) {
//                 throw err;
//                 connection.release();
//             }
//             connection.release();
//
//             // 조회(LOOT_BOX_API)
//             rows.forEach(function (row) {
//                 logger.getLogger().info(utils.format("scheduler saveUsersAchievements user tag: " + row.tag));
//
//                 // 능력치를 저장합니다.
//                 pwyf.saveUsersAchievements(row);
//             });
//         });
//     });
// }).start();
//
// cron.schedule('20 */3 * * *', function () {
//
//     logger.getLogger().info(utils.format('running a task of updating saveUsersStatsForAllHeroes every time. ' + new Date()));
//
//     // 1일 동안 업데이트 안된 대상 명단 조회
//     conn.getConnection(function (err, connection) {
//         connection.query(jsonSql.selectTagListForUpdate, ["2", "", ""], function (err, rows) {
//
//             // 에러 발생시
//             if (err) {
//                 throw err;
//                 connection.release();
//             }
//             connection.release();
//
//             // 조회(LOOT_BOX_API)
//             rows.forEach(function (row) {
//                 logger.getLogger().info(utils.format("scheduler saveUsersStatsForAllHeroes user tag: " + row.tag));
//
//                 // 능력치를 저장합니다.
//                 pwyf.saveUsersStatsForAllHeroes(row);
//             });
//         });
//     });
// }).start();
//
// cron.schedule('30 */3 * * *', function () {
//
//     logger.getLogger().info(utils.format('running a task of updating saveOverallHeroStats every time. ' + new Date()));
//
//     // 1일 동안 업데이트 안된 대상 명단 조회
//     conn.getConnection(function (err, connection) {
//         connection.query(jsonSql.selectTagListForUpdate, ["3", "", ""], function (err, rows) {
//
//             // 에러 발생시
//             if (err) {
//                 throw err;
//                 connection.release();
//             }
//             connection.release();
//
//             // 조회(LOOT_BOX_API)
//             rows.forEach(function (row) {
//                 logger.getLogger().info(utils.format("scheduler saveOverallHeroStats user tag: " + row.tag));
//
//                 // 능력치를 저장합니다.
//                 pwyf.saveOverallHeroStats(row);
//             });
//         });
//     });
// }).start();
//
// cron.schedule('40 */3 * * *', function () {
//
//     logger.getLogger().info(utils.format('running a task of updating getUsersStatsForMultipleHeroes every time. ' + new Date()));
//
//     // 1일 동안 업데이트 안된 대상 명단 조회
//     conn.getConnection(function (err, connection) {
//         connection.query(jsonSql.selectAllHeroList, ["", ""], function (err, rows) {
//             connection.release();
//
//             // 에러 발생시
//             if (err) {
//                 throw err;
//             }
//
//             var list = new Array();
//
//             if (rows != null && rows.length > 0) {
//                 rows.forEach(function (row) {
//                     if (row.json != null) {
//                         var idx = 0;
//                         JSON.parse(row.json).forEach(function (hero) {
//                             list.push({
//                                 idx: idx++,
//                                 tag: row.tag,
//                                 subtype: row.subtype,
//                                 heroName: hero.name,
//                                 platformName: row.platformName,
//                                 regionName: row.regionName
//                             });
//                         });
//                     }
//                 });
//             }
//
//             for (var i = 0, cnt = list.length / 10; i < cnt; i++ ) {
//                 var sttIdx = i * 10;
//                 var endIdx = i < cnt - 1 ? (i + 1) * 10 : list.length;
//                 var sliceList = list.slice(sttIdx, endIdx);
//                 setTimeout(function (sliceList) {
//                     sliceList.forEach(function(result) {
//                         pwyf.getUsersStatsForMultipleHeroes(result);
//                     });
//                 }, i * 60 * 1000, sliceList);
//             }
//         });
//     });
// }).start();
//
// cron.schedule('0 */10 * * * *', function () {
//     logger.getLogger().info(utils.format('running a task of updating hello friends list every time. ' + new Date()));
//
//     // 친구 목록 업데이트
//     conn.getConnection(function (err, connection) {
//         connection.query(helloFriendsSql.insertHelloFriendsList, function (err, rows) {
//             connection.release();
//
//             // 에러 발생시
//             if (err) {
//                 logger.getLogger().error(err);
//                 throw err;
//             }
//         });
//     });
// }).start();