var conn = require('../database/sql/connectionString');
var jsonSql = require('../database/sql/jsonSql');
var userSql = require('../database/sql/userSql');
var lootbox = require('../service/lootbox');
var arrMode = ["competitive", "quickplay"];
var pwyf = require('../service/pwyf');

exports.saveUserJson = function (row) {
    console.log("db save user josn string. row: " + row.seq);

    // type 0번 json save
    lootbox.getUsersStats(row).then(function (response) {
        console.log("scheduler getUsersStats: " + response);
        if (response != undefined && (JSON.parse(response).statusCode == undefined || JSON.parse(response).statusCode == 200)) {
            pwyf.deleteUserJsonWithParams(row, "0", "", "");
            pwyf.insertUserJson(row, "0", "", response, "");
        }
    });

    // type 1번 json save
    lootbox.getUsersAchievements(row).then(function (response) {
        console.log("scheduler getUsersAchievements: " + response);
        if (response != undefined && (JSON.parse(response).statusCode == undefined || JSON.parse(response).statusCode == 200)) {
            pwyf.deleteUserJsonWithParams(row, "1", "", "");
            pwyf.insertUserJson(row, "1", "", response, "");
        }
    });

    // type 2번 json save
    for (var i = 0, cnt = arrMode.length; i < cnt; i++) {
        lootbox.getUsersStatsForAllHeroes(row, arrMode[i]).then(function (response) {
            console.log("scheduler getUsersStatsForAllHeroes: " + response);
            if (response != undefined  && response[1] != undefined && (JSON.parse(response[1]).statusCode == undefined || JSON.parse(response[1]).statusCode == 200)) {
                pwyf.deleteUserJsonWithParams(row, "2", response[0], "");
                pwyf.insertUserJson(row, "2", response[0], response[1], "");
            }
        });
    }

    // type 3번 json save
    for (var i = 0, cnt = arrMode.length; i < cnt; i++) {
        lootbox.getOverallHeroStats(row, arrMode[i]).then(function (response) {
            console.log("scheduler getOverallHeroStats: " + response);
            if (response != undefined && response[1] != undefined && (JSON.parse(response[1]).statusCode == undefined || JSON.parse(response[1]).statusCode == 200)) {
                pwyf.deleteUserJsonWithParams(row, "3", response[0], "");
                pwyf.insertUserJson(row, "3", response[0], response[1], "");
                var overalHeroStats = JSON.parse(response[1]);

                // type 4번 json save
                overalHeroStats.forEach(function (hero) {
                    console.log("scheduler getUsersStatsForMultipleHeroes: hero.name" + hero.name);
                    lootbox.getUsersStatsForMultipleHeroes(row, response[0], hero.name).then(function (arrResponse) {
                        console.log("scheduler getUsersStatsForMultipleHeroes: arrResponse" + arrResponse);

                        if (arrResponse != undefined && arrResponse[2] != undefined && (JSON.parse(arrResponse[2]).statusCode == undefined || JSON.parse(arrResponse[2]).statusCode == 200)) {
                            pwyf.deleteUserJsonWithParams(arrResponse[0], "4", arrResponse[1], arrResponse[3]);
                            pwyf.insertUserJson(arrResponse[0], "4", arrResponse[1], arrResponse[2], arrResponse[3]);
                        }
                    });
                });
            }
        });
    }
};

exports.deleteUserJson = function (row) {
    console.log("db delete user josn string. row: " + row.seq);

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
};

exports.deleteUserJsonWithParams = function (row, type, subtype, heroname) {
    console.log("db deleteUserJsonWithParams string. row: " + row.seq + " type: " + type + " subtype: " + subtype + " heroname: " + heroname);

    conn.getConnection(function (err, connection) {

        var arrParams = [row.seq, type];
        var sql = jsonSql.deleteUserJsonWithType;
        if (subtype != "" && heroname != "") {
            sql = jsonSql.deleteUserJsonWithTypeAndSubTypeAndHeroname;
            arrParams = [row.seq, type, subtype, heroname];
        }
        else {
            sql = jsonSql.deleteUserJsonWithTypeAndSubType;
            arrParams = [row.seq, type, subtype];
        }

        console.log("deleteUserJsonWithParams. sql: " + sql + " arrParams: " + arrParams);
        if (sql == undefined || sql == "") {
            console.log("deleteUserJsonWithParams. sql undefined ");
        }

        try {
            connection.query(sql, arrParams, function (err, rows) {
                // 에러 발생시
                if (err) {
                    console.log("deleteUserJsonWithParams error: " + err.toString());
                    console.log("deleteUserJsonWithParams error. sql: " + sql + " arrParams: " + arrParams);
                    connection.release();
                    throw err;
                }
                console.log("deleteUserJsonWithParams success");
                connection.release();
            });
        }
        catch (Exception) {
            console.log("deleteUserJsonWithParams Exception: " + Exception);
        }

    });
};

exports.insertUserJson = function (row, type, subtype, response, heroname) {
    console.log("db insert string. \nrow: " + row.seq + " \ntype: " + type + " \nsubtype: " + subtype + " \nresponse: " + response + " \nheroname: " + heroname);

    // 대상 명단 조회(PWYF)
    try {
        conn.getConnection(function (err, connection) {
            var sql = jsonSql.insertUserJson;
            console.log("insertUserJson. sql: " + sql);
            connection.query(sql, [row.seq, type, subtype, heroname, response], function (err) {
                // 에러 발생시
                if (err) {
                    console.log("insertUserJson error: " + err.toString());
                    connection.release();
                    throw err;
                }
                console.log("insertUserJson success");
                connection.release();
            });
        });
    }
    catch (Exception) {
        console.log("insertUserJson Exception: " + Exception);
    }
};

exports.updateUserJson = function (row, type, response) {
    console.log("db insert string. row: " + row.seq + " response: " + response);
    console.log("UPDATE json SET json = " + response + ", mod_date = NOW() WHERE seq = " + row.seq + " AND type = " + 2);
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
};

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
};

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
};


