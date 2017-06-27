var conn = require('../database/sql/connectionString');
var jsonSql = require('../database/sql/jsonSql');
var userSql = require('../database/sql/userSql');
var lootbox = require('../service/lootbox');
var arrMode = ["competitive", "quickplay"];
var pwyf = require('../service/pwyf');
var async = require('async');
var promise = require('promise');
var sleep = require('thread-sleep');
var timers = require('timers');
var logger = require('../utils/logger');
var utils = require('util')

exports.saveUserJson = function (id) {

    // 업데이트 대상 명단 조회
    conn.getConnection(function (err, connection) {
        connection.query(userSql.getUpdateUser, [id], function (err, rows) {
            connection.release();

            // 에러 발생시
            if (err) {
                throw err;
            }

            pwyf.saveUsersStats(rows[0]);
            pwyf.saveUsersAchievements(rows[0]);
            pwyf.saveUsersStatsForAllHeroes(rows[0]);
            pwyf.saveOverallHeroStats(rows[0]);
        });
    });

    // 업데이트 대상 명단 조회
    setTimeout(function () {
        conn.getConnection(function (err, connection) {
            connection.query(jsonSql.selectAllHeroList, [id, id], function (err, rows) {
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

                if (list.length > 0) {
                    for (var i = 0, cnt = list.length / 10; i < cnt; i++) {
                        var sttIdx = i * 10;
                        var endIdx = i < cnt - 1 ? (i + 1) * 10 : list.length;
                        var sliceList = list.slice(sttIdx, endIdx);
                        setTimeout(function (sliceList) {
                            sliceList.forEach(function (result) {
                                pwyf.getUsersStatsForMultipleHeroes(result);
                            });
                        }, (i * 60 * 1000) + 60 * 1000, sliceList);
                    }
                }
            });

        });
    }, 60 * 1000);
};

exports.saveUsersStats = function (row) {
    logger.getLogger().info(utils.format("called pwyf saveUsersStats. row: " + row.tag));

    // 능력치를 저장합니다.
    // type 0번 json save
    lootbox.getUsersStats(row).then(function (response) {
        logger.getLogger().info(utils.format("called lootbox getUsersStats: " + response));
        if (response != undefined && (JSON.parse(response).statusCode == undefined || JSON.parse(response).statusCode == 200) && response.length > 100) {
            pwyf.deleteUserJsonWithParams(row.tag, "0", "", "", response).then(function (result) {
                if (result) {
                    pwyf.insertUserJson(row.tag, "0", "", response, "");
                }
            });
        }
    });
};

exports.saveUsersAchievements = function (row) {
    logger.getLogger().info(utils.format("called pwyf saveUsersAchievements. row: " + row.tag));

    // type 1번 json save
    lootbox.getUsersAchievements(row).then(function (response) {
        logger.getLogger().info(utils.format("called lootbox getUsersAchievements: " + response));
        if (response != undefined && (JSON.parse(response).statusCode == undefined || JSON.parse(response).statusCode == 200) && response.length > 100) {
            pwyf.deleteUserJsonWithParams(row.tag, "1", "", "").then(function (result) {
                if (result) {
                    pwyf.insertUserJson(row.tag, "1", "", response, "");
                }
            });
        }
    });
};

exports.saveUsersStatsForAllHeroes = function (row) {
    logger.getLogger().info(utils.format("called pwyf saveUsersStatsForAllHeroes. row: " + row.tag));

    // type 2번 json save
    for (var i = 0, cnt = arrMode.length; i < cnt; i++) {
        lootbox.getUsersStatsForAllHeroes(row, arrMode[i]).then(function (response) {
            logger.getLogger().info(utils.format("called lootbox getUsersStatsForAllHeroes: " + response));
            if (response != undefined && response[1] != undefined && (JSON.parse(response[1]).statusCode == undefined || JSON.parse(response[1]).statusCode == 200) && response[1].length > 100) {
                pwyf.deleteUserJsonWithParams(row.tag, "2", response[0], "").then(function (result) {
                    if (result) {
                        pwyf.insertUserJson(row.tag, "2", response[0], response[1], "");
                    }
                });
            }
        });
    }
};

exports.saveOverallHeroStats = function (row) {
    logger.getLogger().info(utils.format("called pwyf saveOverallHeroStats. row: " + row.tag));

    // type 3번 json save
    for (var i = 0, cnt = arrMode.length; i < cnt; i++) {
        lootbox.getOverallHeroStats(row, arrMode[i]).then(function (response) {
            logger.getLogger().info(utils.format("called lootbox getOverallHeroStats: " + response));
            if (response != undefined && response[1] != undefined && (JSON.parse(response[1]).statusCode == undefined || JSON.parse(response[1]).statusCode == 200) && response[1].length > 100) {
                pwyf.deleteUserJsonWithParams(row.tag, "3", response[0], "").then(function (result) {
                    if (result) {
                        pwyf.insertUserJson(row.tag, "3", response[0], response[1], "");
                    }
                });
            }
        });
    }
};

exports.getUsersStatsForMultipleHeroes = function (row) {
    logger.getLogger().info(utils.format("called pwyf saveOverallHeroStats. row: " + row.tag));

    // 조회(LOOT_BOX_API)
    lootbox.getUsersStatsForMultipleHeroes(row).then(function (response) {
        logger.getLogger().info(utils.format("scheduler getUsersStatsForMultipleHeroes: arrResponse" + response));
        if (response != undefined && response[1] != undefined) {
            pwyf.deleteUserJsonWithParams(response[0].tag, "4", response[0].subtype, response[0].heroName).then(function (result) {
                if (result) {
                    pwyf.insertUserJson(response[0].tag, "4", response[0].subtype, response[1], response[0].heroName);
                }
            });
        }
    });
};

exports.deleteUserJsonWithParams = function (tag, type, subType, heroName) {

    return new Promise(function (resolve, reject) {

        logger.getLogger().info(utils.format("db deleteUserJsonWithParams string. row: " + tag + " type: " + type + " subType: " + subType + " heroName: " + heroName));
        conn.getConnection(function (err, connection) {
            if (err) {
                logger.getLogger().info(utils.format("insertUserJson deleteUserJsonWithParams error: " + err.toString()));
                throw err;
            }

            var sql;
            var arrParams;
            if (type == 0 || type == 1) {
                sql = jsonSql.deleteUserJsonWithType;
                arrParams = [tag, type];
            }
            else if (type == 2 || type == 3) {
                sql = jsonSql.deleteUserJsonWithTypeAndSubType;
                arrParams = [tag, type, subType];
            }
            else if (type == 4) {
                sql = jsonSql.deleteUserJsonWithTypeAndSubTypeAndHeroname;
                arrParams = [tag, type, subType, heroName];
            }

            logger.getLogger().info(utils.format("deleteUserJsonWithParams. sql: " + sql + " arrParams: " + arrParams));
            if (sql == undefined || sql == "") {
                logger.getLogger().info("deleteUserJsonWithParams. sql undefined ");
            }

            try {
                connection.query(sql, arrParams, function (err, response) {
                    connection.release();
                    // 에러 발생시
                    if (err) {
                        logger.getLogger().info(utils.format("deleteUserJsonWithParams error: " + err.toString()));
                        logger.getLogger().info(utils.format("deleteUserJsonWithParams error. sql: " + sql + " arrParams: " + arrParams));
                        throw err;
                    }
                    logger.getLogger().info(utils.format("deleteUserJsonWithParams success. tag: " + arrParams[0]));
                    return resolve(true);
                });
            }
            catch (err) {
                logger.getLogger().info(utils.format("deleteUserJsonWithParams Exception: " + err));
                throw err;
            }

        });
    });
};

exports.insertUserJson = function (tag, type, subtype, response, heroName) {
    logger.getLogger().info(utils.format("db insert string. \nrow: " + tag + " \ntype: " + type + " \nsubtype: " + subtype + " \nresponse: " + response + " \nheroName: " + heroName));

    try {
        conn.getConnection(function (err, connection) {
            if (err) {
                logger.getLogger().info(utils.format("insertUserJson getConnection error: " + err.toString()));
                throw err;
            }

            connection.query(jsonSql.insertUserJson, [tag, type, subtype, heroName, response], function (err) {
                connection.release();

                // 에러 발생시
                if (err) {
                    logger.getLogger().info(utils.format("insertUserJson error: " + err.toString()));
                    throw err;
                }
                logger.getLogger().info(utils.format("insertUserJson success. tag: " + tag));
            });
        });
    }
    catch (Exception) {
        logger.getLogger().info(utils.format("insertUserJson Exception: " + Exception));
    }
};