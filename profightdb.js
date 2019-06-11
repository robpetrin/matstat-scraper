'use strict';
const tabletojson = require('tabletojson');
const fs = require('fs');
const json2csv = require('json2csv').parse;

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

console.log("We got the links!");
