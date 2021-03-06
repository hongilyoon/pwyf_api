var conn = require('../database/sql/connectionString');
var jsonSql = require('../database/sql/jsonSql');
var userSql = require('../database/sql/userSql');
var rp = require('request-promise')
var logger = require('../utils/logger');
var utils = require('util')

// Type: 0, Stats 조회하는 url
var usersStatsUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/profile";

// Type: 1, Achievements 조회하는 url
var usersAchievementsUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/achievements";

// Type: 2, Stats For All Heroes 조회하는 url
var usersStatsForAllHeroesUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/{mode}/allHeroes/";

// Type: 3, Overall Hero Stat 조회하는 url
var overallHeroStatsUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/{mode}/heroes";

// Type: 4, Multiple Heroes Stats 조회하는 url
var usersStatsForMultipleHeroesUrl = "https://api.lootbox.eu/{platform}/{region}/{tag}/{mode}/hero/{heroes}/";

// 사용자 능력치 조회
exports.getUsersStats = function (row) {
    var urlString = usersStatsUrl.replace(/{platform}/g, row.platformName).replace(/{region}/g, row.regionName).replace(/{tag}/g, encodeURIComponent(row.tag));
    logger.getLogger().info(utils.format("urlString: " + urlString));
    return rp({
        method: 'GET',
        uri: urlString,
        timeout: 10 * 60 * 1000,
        rejectUnauthorized: false
    })
        .then(function (response) {
            return response;
        })
        .catch(function (err) {
            logger.getLogger().error(err);
        });
};

// 사용자 성과 조회
exports.getUsersAchievements = function (row) {
    var urlString = usersAchievementsUrl.replace(/{platform}/g, row.platformName).replace(/{region}/g, row.regionName).replace(/{tag}/g, encodeURIComponent(row.tag));
    logger.getLogger().info(utils.format("urlString: " + urlString));
    return rp({
        method: 'GET',
        uri: urlString,
        timeout: 10 * 60 * 1000,
        rejectUnauthorized: false
    })
        .then(function (response) {
            return response;
        })
        .catch(function (err) {
            logger.getLogger().error(err);
        });
};

// 사용자의 모든 영웅을 조회
exports.getUsersStatsForAllHeroes = function (row, mode) {
    var urlString = usersStatsForAllHeroesUrl.replace(/{platform}/g, row.platformName).replace(/{region}/g, row.regionName).replace(/{tag}/g, encodeURIComponent(row.tag)).replace(/{mode}/g, mode);
    logger.getLogger().info(utils.format("urlString: " + urlString));
    return rp({
        method: 'GET',
        uri: urlString,
        timeout: 10 * 60 * 1000,
        rejectUnauthorized: false
    })
        .then(function (response) {
            return [mode, response];
        })
        .catch(function (err) {
            logger.getLogger().error(err);
        });
};

// 영웅의 전반적인 상태 조회
exports.getOverallHeroStats = function (row, mode) {
    var urlString = overallHeroStatsUrl.replace(/{platform}/g, row.platformName).replace(/{region}/g, row.regionName).replace(/{tag}/g, encodeURIComponent(row.tag)).replace(/{mode}/g, mode);
    logger.getLogger().info(utils.format("urlString: " + urlString));
    return rp({
        method: 'GET',
        uri: urlString,
        timeout: 10 * 60 * 1000,
        rejectUnauthorized: false
    })
        .then(function (response) {
            return [mode, response];
        })
        .catch(function (err) {
            logger.getLogger().error(err);
        });
};

// 여러 영웅의 능력치를 조회
exports.getUsersStatsForMultipleHeroes = function (row) {
    var replaceName = row.heroName.replace(/&#xFA;/g, "u").replace(/&#xF6;/g, "o");
    var urlString = usersStatsForMultipleHeroesUrl.replace(/{platform}/g, row.platformName).replace(/{region}/g, row.regionName).replace(/{tag}/g, encodeURIComponent(row.tag)).replace(/{mode}/g, row.subtype).replace(/{heroes}/g, replaceName);
    logger.getLogger().info(utils.format("urlString: " + urlString));
    return rp({
        method: 'GET',
        uri: urlString,
        timeout: 10 * 60 * 1000,
        rejectUnauthorized: false
    })
        .then(function (response) {
            return [row, response];
        })
        .catch(function (err) {
            logger.getLogger().error(err);
        });
};
