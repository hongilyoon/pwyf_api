var conn = require('../database/connectionString');
var jsonSql = require('../database/jsonSql');
var userSql = require('../database/userSql');
var rp = require('request-promise')

// 사용자 능력치 조회하는 url
var usersStatsUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/profile";

// 사용자의 성과를 조회하는 url
var usersAchievementsUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/achievements";

// 사용자의 모든 영웅을 조회하는 url
var usersStatsForAllHeroesUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/{mode}/allHeroes/";

// 여러 영웅의 능력치를 조회하는 url
var usersStatsForMultipleHeroesUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/{mode}/hero/{heroes}/";

var overallHeroStatsUrl =  "https://api.lootbox.eu/{platform}/{region}/{tag}/{mode}/heroes";

// 사용자 능력치 조회
exports.getUsersStats = function (row) {

    var type = "1";
    var urlString = usersStatsUrl.replace(/{platform}/g, row.platformName).replace(/{region}/g, row.regionName).replace(/{tag}/g, encodeURIComponent(row.tag));
    console.log("urlString: " + urlString);
    return rp({
        method: 'GET',
        uri: urlString
    })
        .then(function (response) {
            return response;
        })
        .catch(function (err) {
            // Something bad happened, handle the error
            console.log("err: " + err);
        });
}

// 사용자 성과 조회
exports.getUsersAchievements = function (row) {

    var type = "0";
    var urlString = usersAchievementsUrl.replace(/{platform}/g, row.platformName).replace(/{region}/g, row.regionName).replace(/{tag}/g, encodeURIComponent(row.tag));
    console.log("urlString: " + urlString);
    return rp({
        method: 'GET',
        uri: urlString
    })
        .then(function (response) {
            return response;
        })
        .catch(function (err) {
            // Something bad happened, handle the error
            console.log("err: " + err);
        });
}