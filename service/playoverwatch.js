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

exports.getExample = function (tagId) {
    // var url = playOverwatchUrl + tagId;
    var url = "https://playoverwatch.com/ko-kr/career/pc/kr/%EB%A5%98%ED%81%AC%EC%8A%A4%EC%B9%B4%EC%9D%B4%EC%9B%8C%EC%BB%A4-3143";
    return rp({
        method: 'GET',
        uri: url,
        timeout: 10 * 60 * 1000,
        rejectUnauthorized: false
    })
    .then(function (response) {
        var $ = cheerio.load(response);
        var postElements = $("section.highlights-section div.card-content");
        var result = []
        postElements.each(function() {
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






    // request(url, function(error, response, body) {
    //     if (error) {
    //         throw error;
    //     }
    //
    //     var $ = cheerio.load(body);
    //     var postElements = $("section.highlights-section div.card-content");
    //     var result = []
    //     postElements.each(function() {
    //         var title = $(this).find("p").text();
    //         var value = $(this).find("h3").text();
    //         var obj = {"title": title, "value": value};
    //         result.push(obj);
    //     });
    //
    //     return result;
    // });

}





