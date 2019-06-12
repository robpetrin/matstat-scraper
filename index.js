'use strict';
const fs = require('fs'),
    cheerio = require('cheerio'),
    request = require('request');

var urlBase = "http://www.profightdb.com/atoz.html?term=";
var urlMid = "&start=";
var letters = [];
for (var i = 97; i <= 122; i++) { letters.push(String.fromCodePoint(i)) }
var linkList = [];

letters.forEach(function(v) {
    for (let i = 0; i < 22; i++) {
        var fullURL = urlBase + v + urlMid + (i * 100).toString();
        linkList.push(fullURL);
    }
});

request('https://news.ycombinator.com', function(error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('span.comhead').each(function(i, element) {
            var a = $(this).prev();
            var rank = a.parent().parent().text();
            var title = a.text();
            var url = a.attr('href');
            var subtext = a.parent().parent().next().children('.subtext').children();
            var points = $(subtext).eq(0).text();
            var username = $(subtext).eq(1).text();
            var comments = $(subtext).eq(2).text();
            // Our parsed meta data object
            var metadata = {
                rank: parseInt(rank),
                title: title,
                url: url,
                points: parseInt(points),
                username: username,
                comments: parseInt(comments)
            };
            console.log(metadata);
        });
    }
});

console.log(linkList.length + " links added to the list!");