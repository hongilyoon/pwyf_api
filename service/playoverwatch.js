var conn = require('../database/sql/connectionString');
var jsonSql = require('../database/sql/jsonSql');
var userSql = require('../database/sql/userSql');
var rp = require('request-promise')
var logger = require('../utils/logger');
var utils = require('util')
var request = require("request");
var cheerio = require("cheerio");
var promise = require('promise');
var playOverwatchUrl = "https://playoverwatch.com/{lang}/career/pc/{region}/";

//en-us, ko-kr

var heroCnt = 24;
var arrQuickPlayProperties = ["playTime", "victoriousGames", "accuracy", "perLife", "simultaneousTreatment", "missionContribution"];
var arrCompetitionProperties = ["playTime", "victoriousGames", "odds", "accuracy", "perLife", "simultaneousTreatment", "missionContribution"];
var arrTotalStatisticsValue = ["ALL HEROES", "Reaper", "Tracer", "Mercy",
    "Hanzo", "Torbjörn", "Reinhardt", "Pharah", "Winston", "Widowmaker",
    "Bastion", "Symmetra", "Zenyatta", "Genji", "Roadhog", "McCree",
    "Junkrat", "Zarya", "Soldier: 76", "Lúcio", "D.Va", "Mei",
    "Sombra", "Ana", "Orisa"];
var arrTotalStatisticsKey = ["0x02E00000FFFFFFFF", "0x02E0000000000002", "0x02E0000000000003", "0x02E0000000000004",
    "0x02E0000000000005", "0x02E0000000000006", "0x02E0000000000007", "0x02E0000000000008", "0x02E0000000000009", "0x02E000000000000A",
    "0x02E0000000000015", "0x02E0000000000016", "0x02E0000000000020", "0x02E0000000000029", "0x02E0000000000040", "0x02E0000000000042",
    "0x02E0000000000065", "0x02E0000000000068", "0x02E000000000006E", "0x02E0000000000079", "0x02E000000000007A", "0x02E00000000000DD",
    "0x02E000000000012E", "0x02E000000000013B", "0x02E000000000013E"];

var arrAchievementsValue = ["General", "Offense", "Defense", "Tank", "Support", "Maps", "Special"];
var arrAchievementsKey = ["overwatch.achievementCategory.0", "overwatch.achievementCategory.1", "overwatch.achievementCategory.2",
    "overwatch.achievementCategory.3", "overwatch.achievementCategory.4", "overwatch.achievementCategory.5", "overwatch.achievementCategory.6"];

exports.getUser = function(lang, region, tagId) {
    var url = playOverwatchUrl.replace("{lang}", lang).replace("{region}", region) + encodeURIComponent(tagId);
    return rp({
        method: 'GET',
        uri: url,
        timeout: 10 * 60 * 1000,
        rejectUnauthorized: false
    })
    .then(function (response) {
        var $ = cheerio.load(response);
        var divMaterHead = $("div.masthead-player");
        var wins = $("p.masthead-detail span").text();
        var avatar = $(divMaterHead).find("img").attr("src");
        var userName = $(divMaterHead).find("h1").text();

        var divCompetitiveRank = $(divMaterHead).find("div.competitive-rank");
        var competitiveRankImg = $(divCompetitiveRank).find("img").attr("src");
        var competitiveRank = $(divCompetitiveRank).find("div").text();

        var divPlayerLevel = $(divMaterHead).find("div.player-level");
        var playerLevelImgBorder = null;
        if ( $(divPlayerLevel).attr("style") != undefined) {
            playerLevelImgBorder = $(divPlayerLevel).attr("style").replace("background-image:url(", "").replace(")", "");
        }
        var playerLevelImg = null;
        if ($(divMaterHead).find("div.player-rank").attr("style") != undefined) {
            playerLevelImg  = $(divMaterHead).find("div.player-rank").attr("style").replace("background-image:url(", "").replace(")", "");
        }
        var playerLevel = $($(divPlayerLevel).find("div")[0]).text();

        return {"userName" : userName, "avatar" : avatar, "wins": wins,
            "competitiveRankImg": competitiveRankImg, "competitiveRank": competitiveRank,
            "playerLevel": playerLevel, "playerLevelImg": playerLevelImg, "playerLevelImgBorder": playerLevelImgBorder};
    })
    .catch(function (err) {
        logger.getLogger().error(err);
    });
};

exports.getMainStatistics = function (lang, region, type, tagId) {
    var url = playOverwatchUrl.replace("{lang}", lang).replace("{region}", region) + encodeURIComponent(tagId);
    return rp({
        method: 'GET',
        uri: url,
        timeout: 10 * 60 * 1000,
        rejectUnauthorized: false
    })
    .then(function (response) {
        var $ = cheerio.load(response);
        var postElements = $("div#{type} div.card-content".replace(/{type}/g, type));
        var result = [];
        postElements.each(function () {
            var title = $(this).find("p").text();
            var value = $(this).find("h3").text();
            var obj = {"title": title, "value": value};
            result.push(obj);
        });

        return {"data": result};
    })
    .catch(function (err) {
        logger.getLogger().error(err);
    });
};

exports.getHeroesStatistics = function (lang, region, type, tagId) {
    var url = playOverwatchUrl.replace("{lang}", lang).replace("{region}", region) + encodeURIComponent(tagId);
    return rp({
        method: 'GET',
        uri: url,
        timeout: 10 * 60 * 1000,
        rejectUnauthorized: false
    })
    .then(function (response) {
        var $ = cheerio.load(response);
        var result = {};
        var postElements = $("div#{type} div.bar-text".replace(/{type}/g, type));
        postElements.each(function (i) {
            var obj = {
                "title": $(this).find("div.title").text(),
                "value": $(this).find("div.description").text(),
                "percent": $(this).parent("div").parent("div").attr("data-overwatch-progress-percent"),
                "img": $(this).parent("div").parent("div").find("img").attr("src")};
            var propertyName = type == "quickplay" ? arrQuickPlayProperties[parseInt(i / heroCnt)] : arrCompetitionProperties[parseInt(i / heroCnt)];
            var arrObj = result[propertyName];
            if (arrObj == null || arrObj == undefined || arrObj.length < 1) {
                arrObj = new Array();
                arrObj.push(obj);
                result[propertyName] = arrObj;
            } else {
                arrObj.push(obj);
                result[propertyName] = arrObj;
            }
        });

        return result;
    })
    .catch(function (err) {
        logger.getLogger().error(err);
    });
};

exports.getTotalStatistics = function (lang, region, type, tagId) {
    var url = playOverwatchUrl.replace("{lang}", lang).replace("{region}", region) + encodeURIComponent(tagId);
    return rp({
        method: 'GET',
        uri: url,
        timeout: 10 * 60 * 1000,
        rejectUnauthorized: false
    })
    .then(function (response) {
        var $ = cheerio.load(response);
        var result = {};
        var postElements = $("div#{type} section.career-stats-section".replace(/{type}/g, type));
        postElements.each(function () {
            for (var i = 0; i < arrTotalStatisticsKey.length; i++) {
                $(this).find("[data-category-id='" + arrTotalStatisticsKey[i] + "'] .data-table").each(function () {
                    var arrTotal = new Array();
                    $(this).find("tbody tr").each(function () {
                        arrTotal.push({
                            "title": $($(this).find("td")[0]).text(),
                            "value": $($(this).find("td")[1]).text()
                        });
                    });
                    var obj = {"subject": $(this).find("thead span.stat-title").text(), "total": arrTotal};
                    var arrObj = result[arrTotalStatisticsValue[i]];
                    if (arrObj == null || arrObj == undefined || arrObj.length < 1) {
                        arrObj = new Array();
                        arrObj.push(obj);
                        result[arrTotalStatisticsValue[i]] = arrObj;
                    }
                    else {
                        arrObj.push(obj);
                        result[arrTotalStatisticsValue[i]] = arrObj;
                    }
                });
            }
            ;
        });

        return result;
    })
    .catch(function (err) {
        logger.getLogger().error(err);
    });
};

exports.getAchievementsStatistics = function (lang, region, tagId) {
    var url = playOverwatchUrl.replace("{lang}", lang).replace("{region}", region) + encodeURIComponent(tagId);
    return rp({
        method: 'GET',
        uri: url,
        timeout: 10 * 60 * 1000,
        rejectUnauthorized: false
    })
        .then(function (response) {
            var $ = cheerio.load(response);
            var result = {};
            var sectionAchievement = $("section#achievements-section");
            for (var i = 0; i < arrAchievementsKey.length; i++) {
                var divAchievement = $(sectionAchievement).find("div[data-category-id='{value}']".replace("{value}", arrAchievementsKey[i]));
                var arrAchievement = new Array();
                $(divAchievement).find("div.column").each(function () {
                    var divAchievementCard = $(this).find("div.achievement-card");
                    arrAchievement.push({
                        "img": $(divAchievementCard).find("img").attr("src"),
                        "title": $(divAchievementCard).find("div.media-card-title").text(),
                        "isCompleted": !$(divAchievementCard).hasClass("m-disabled"),
                        "desc": $(divAchievementCard).next().find("p").text()})
                });

                result[arrAchievementsValue[i]] = arrAchievement;
            }

            return result;
        })
        .catch(function (err) {
            logger.getLogger().error(err);
        });
};


