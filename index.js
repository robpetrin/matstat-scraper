'use strict';
const fs = require('fs'),
    cheerio = require('cheerio'),
    request = require('request'),
    ObjectsToCsv = require('objects-to-csv'),
    urlBase = "http://www.profightdb.com/atoz.html?term=",
    urlMid = "&start=";
var linkList = [],
    letters = [],
    performerList = [];

// (1) Populate letters array with entire alphabet
for (var i = 97; i <= 122; i++) { letters.push(String.fromCodePoint(i)) }

// (2) Cultivate A-Z link list of performers, genders, DOB, POB, and notes

letters.forEach(function(v) {
    for (let i = 0; i < 22; i++) {
        var fullURL = urlBase + v + urlMid + (i * 100).toString();
        linkList.push(fullURL);
    }
});

// (3) Make a request per letter, through each page, and write to objects within a master array

linkList.forEach(function(v) {
    request(v, function(error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            $('tr.gray').each(function(i, element) {
                var gender = $(this).find(">:first-child").find('img').attr('alt');
                var ringName = [$(this).find(">:first-child").find('img').next().text()];
                var performerURL = $(this).find(">:first-child").find('img').next().attr('href')
                var dob = $(this).find(">:nth-child(2)").text();
                var pob = $(this).find(">:nth-child(3)").text();
                var notes = $(this).find(">:nth-child(4)").text();
                // Passing to a Performer Object
                var performers = {
                    ringName: ringName,
                    URL: performerURL,
                    dob: dob,
                    pob: pob,
                    gender: gender,
                    notes: notes
                };
                // Pushing new performer to array of performers
                performerList.push(performers);
            });
        }
        new ObjectsToCsv(performerList).toDisk('./performers.csv');
        console.log(performerList.length + " performers written to performers.csv")
    });
});