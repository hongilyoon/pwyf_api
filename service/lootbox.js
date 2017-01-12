var conn = require('../database/sql/connectionString');
var jsonSql = require('../database/sql/jsonSql');
var userSql = require('../database/sql/userSql');
var rp = require('request-promise')

// 사용자 능력치 조회하는 url
var usersStatsUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/profile";

// 사용자의 성과를 조회하는 url
var usersAchievementsUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/achievements";

// 사용자의 모든 영웅을 조회하는 url
var usersStatsForAllHeroesUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/{mode}/allHeroes/";

// 영웅의 전반적인 상태 조회하는 url
var overallHeroStatsUrl =  "https://api.lootbox.eu/{platform}/{region}/{tag}/{mode}/heroes";

// 여러 영웅의 능력치를 조회하는 url
var usersStatsForMultipleHeroesUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/{mode}/hero/{heroes}/";

// var arrHeroName = ["Zenyatta", "L&#xFA;cio", "Ana", "Zarya", "Tracer", "Soldier", "Mercy", "Hanzo", "Winston", "McCree",
//     "Reaper", "Torbj&#xF6;rn", "Reinhardt", "Pharah", "Widowmaker", "Bastion", "Symmetra", "Genji", "Roadhog", "Junkrat",
//     "D.Va", "Mei", "", "", "", "", "", "", "", "", "", "", "", "", ""]

// 사용자 능력치 조회
exports.getUsersStats = function (row) {
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

// 사용자의 모든 영웅을 조회
exports.getUsersStatsForAllHeroes = function (row, mode) {
    var urlString = usersStatsForAllHeroesUrl.replace(/{platform}/g, row.platformName).replace(/{region}/g, row.regionName).replace(/{tag}/g, encodeURIComponent(row.tag)).replace(/{mode}/g, mode);
    console.log("urlString: " + urlString);
    return rp({
        method: 'GET',
        uri: urlString
    })
        .then(function (response) {
            return [mode, response];
        })
        .catch(function (err) {
            // Something bad happened, handle the error
            console.log("err: " + err);
        });
}

// 영웅의 전반적인 상태 조회
exports.getOverallHeroStats = function (row, mode) {
    var urlString = overallHeroStatsUrl.replace(/{platform}/g, row.platformName).replace(/{region}/g, row.regionName).replace(/{tag}/g, encodeURIComponent(row.tag)).replace(/{mode}/g, mode);
    console.log("urlString: " + urlString);
    return rp({
        method: 'GET',
        uri: urlString
    })
        .then(function (response) {
            return [mode, response];
        })
        .catch(function (err) {
            // Something bad happened, handle the error
            console.log("err: " + err);
        });
}

// 여러 영웅의 능력치를 조회
exports.getUsersStatsForMultipleHeroes = function (row, mode, heroname) {
    var urlString = usersStatsForMultipleHeroesUrl.replace(/{platform}/g, row.platformName).replace(/{region}/g, row.regionName).replace(/{tag}/g, encodeURIComponent(row.tag)).replace(/{mode}/g, mode).replace(/{heroes}/g, heroname);
    console.log("urlString: " + urlString);
    return rp({
        method: 'GET',
        uri: urlString
    })
        .then(function (response) {
            return [mode, response, heroname];
        })
        .catch(function (err) {
            // Something bad happened, handle the error
            console.log("err: " + err);
        });
}
