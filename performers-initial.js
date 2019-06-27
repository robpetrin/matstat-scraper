'use strict';

const fs = require('fs'),
    chalk = require('chalk'),
    cheerio = require('cheerio'),
    limit = require("simple-rate-limiter"),
    request = limit(require("request")).to(25).per(1000),
    jsonfile = require('jsonfile');

const urlBase = "http://www.profightdb.com/atoz.html?term=",
    urlMid = "&start=";

var linkList = [],
    letters = [],
    performerList = [],
    counter = 0;

// (1) Cultivate A-Z link list of performers, genders, DOB, POB, and notes
function getLinks() {
    // (1.1) Make an array of Letters
    for (var i = 97; i <= 122; i++) { letters.push(String.fromCodePoint(i)) };

    // (1.2) Get my link list, which relies on the letters
    letters.forEach(function(v) {
        for (let i = 0; i < 25; i++) {
            var fullURL = urlBase + v + urlMid + (i * 100).toString();
            linkList.push(fullURL);
            /* http://www.profightdb.com/atoz.html?term= + a + &start= + 0
               becomes http://www.profightdb.com/atoz.html?term=a&start=0 */
        }
    });

}

// (3) Make a request per letter, through each page, and write to objects within a master array
async function getPerformers() {
    await linkList.forEach(function(v) {
        // (3.1) Make an HTTP request for each link in my list...
        request(v, function(error, response, html) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html);
                // (3.2) Make a request
                $('tr.gray').each(function(i, element) {
                    var gender = $(this).find(">:first-child").find('img').attr('alt');
                    var ringName = [$(this).find(">:first-child").find('img').next().text()];
                    var performerURL = $(this).find(">:first-child").find('img').next().attr('href') + '?res=2000';
                    var dob = $(this).find(">:nth-child(2)").text();
                    var pob = $(this).find(">:nth-child(3)").text();
                    var notes = $(this).find(">:nth-child(4)").text();
                    // (3.3) Get all of the above table rows and push to an object
                    var performers = {
                        ringName: ringName,
                        URL: performerURL,
                        dob: dob,
                        pob: pob,
                        gender: gender,
                        notes: notes
                    };
                    // (3.4) Push new performer object to array of performers
                    performerList.push(performers);
                    counter++;
                    console.log(chalk.bgHex('#000080').white("Done with performer #" + counter + "."));
                });
            }
        });
    });
}

// (4) Manage my JSON file, whether or not it exists.
function writePerformers() {
    // (4.1) Empty the JSON file if it exists
    fs.writeFile('./exports/performers-initial.json', '', function() {
        console.log('JSON file emptied.')
    });

    // (4.2) Write array performerList to JSON file
    jsonfile.writeFile('./exports/performers-initial.json', performerList, { flag: 'a' }, function(err) { if (err) console.error(err) });
    console.log("I should be the final line you see.");
}


// (5) Run the request to get my array of objects, then write them to the JSON file.
getLinks();
getPerformers().then(
    setTimeout(writePerformers, 90000));