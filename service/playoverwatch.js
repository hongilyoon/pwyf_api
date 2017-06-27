var conn = require('../database/sql/connectionString');
var jsonSql = require('../database/sql/jsonSql');
var userSql = require('../database/sql/userSql');
var rp = require('request-promise')
var logger = require('../utils/logger');
var utils = require('util')
var request = require("request");
var cheerio = require("cheerio");
var promise = require('promise');
var playOverwatchUrl = "https://playoverwatch.com/ko-kr/career/pc/kr/";

var heroCnt = 24;
var arrQuckPlayProperties = ["playTime", "victoriousGames", "accuracy", "perLife", "simultaneousTreatment", "missionContribution"];
var arrCompetitionProperties = ["playTime", "victoriousGames", "odds", "accuracy", "perLife", "simultaneousTreatment", "missionContribution"];
var arrTotalStaticsHeroes = ["ALL HEROES", "Reaper", "Tracer", "Mercy",
    "Hanzo", "Torbjörn", "Reinhardt", "Pharah", "Winston", "Widowmaker",
    "Bastion", "Symmetra", "Zenyatta", "Genji", "Roadhog", "McCree",
    "Junkrat", "Zarya", "Soldier: 76", "Lúcio", "D.Va", "Mei",
    "Sombra", "Ana", "Orisa"];
var arrTotalStaticsKeys = ["0x02E00000FFFFFFFF", "0x02E0000000000002", "0x02E0000000000003", "0x02E0000000000004",
    "0x02E0000000000005", "0x02E0000000000006", "0x02E0000000000007", "0x02E0000000000008", "0x02E0000000000009", "0x02E000000000000A",
    "0x02E0000000000015", "0x02E0000000000016", "0x02E0000000000020", "0x02E0000000000029", "0x02E0000000000040", "0x02E0000000000042",
    "0x02E0000000000065", "0x02E0000000000068", "0x02E000000000006E", "0x02E0000000000079", "0x02E000000000007A", "0x02E00000000000DD",
    "0x02E000000000012E", "0x02E000000000013B", "0x02E000000000013E"];

exports.getMainStatistics = function (type, tagId) {
    var url = playOverwatchUrl + tagId;
    url = "https://playoverwatch.com/ko-kr/career/pc/kr/%EB%A5%98%ED%81%AC%EC%8A%A4%EC%B9%B4%EC%9D%B4%EC%9B%8C%EC%BB%A4-3143";
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

        return result;
    })
    .catch(function (err) {
        logger.getLogger().error(err);
    });
};

exports.getHeroesStatistics = function (type, tagId) {
    var url = playOverwatchUrl + tagId;
    url = "https://playoverwatch.com/ko-kr/career/pc/kr/%EB%A5%98%ED%81%AC%EC%8A%A4%EC%B9%B4%EC%9D%B4%EC%9B%8C%EC%BB%A4-3143";
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
            var obj = {"title": $(this).find("div.title").text(), "value": $(this).find("div.description").text()};
            var propertyName = arrQuckPlayProperties[parseInt(i / heroCnt)];
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

exports.getTotalStatistics = function (type, tagId) {
    var url = playOverwatchUrl + tagId;
    url = "https://playoverwatch.com/ko-kr/career/pc/kr/%EB%A5%98%ED%81%AC%EC%8A%A4%EC%B9%B4%EC%9D%B4%EC%9B%8C%EC%BB%A4-3143";
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
            for (var i = 0; i < arrTotalStaticsKeys.length; i++) {
                $(this).find("[data-category-id='" + arrTotalStaticsKeys[i] + "'] .data-table").each(function () {
                    var arrTotal = new Array();
                    $(this).find("tbody tr").each(function () {
                        arrTotal.push({
                            "title": $($(this).find("td")[0]).text(),
                            "value": $($(this).find("td")[1]).text()
                        });
                    });
                    var obj = {"subject": $(this).find("thead span.stat-title").text(), "total": arrTotal};
                    var arrObj = result[arrTotalStaticsHeroes[i]];
                    if (arrObj == null || arrObj == undefined || arrObj.length < 1) {
                        arrObj = new Array();
                        arrObj.push(obj);
                        result[arrTotalStaticsHeroes[i]] = arrObj;
                    }
                    else {
                        arrObj.push(obj);
                        result[arrTotalStaticsHeroes[i]] = arrObj;
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




