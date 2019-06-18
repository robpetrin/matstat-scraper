'use strict';
const fs = require('fs'),
    cheerio = require('cheerio'),
    chalk = require('chalk'),
    limit = require("simple-rate-limiter"),
    request = limit(require("request")).to(50).per(10000),
    ObjectsToCsv = require('objects-to-csv'),
    jsonfile = require('jsonfile');
var initialList = require('./performers-initial.json');

fs.writeFile('./exports/performers-detail.json', '', function() { console.log('JSON file emptied.') })

console.log(initialList)

// (3) Make a request per letter, through each page, and write to objects within a master array
linkList.forEach(async function(v) {
    await request(v, function(error, response, html) {
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
                jsonfile.writeFile('./exports/performers-detail.json', performers, { flag: 'a' }, function(err) {
                    if (err) console.error(err)
                })
                counter++;
                console.log(chalk.hex('#fff').bgHex('#002244')("Done with performer #" + counter + ", added to performers-detail.json"));
            });
        }
        linkCount++;
        console.log(chalk.hex('#fff').bgHex('#C60C30')("Done with link #" + linkCount));
    });
    new ObjectsToCsv(performerList).toDisk('./exports/performers-detail.csv');
    console.log(chalk.hex('#002244').bgHex('#B0B7BC')(performerList.length + " performers written to performers-detail.csv"));
});