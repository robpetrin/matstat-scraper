'use strict';
const tabletojson = require('tabletojson');
const fs = require('fs');
const json2csv = require('json2csv').parse;
var urlBase = "http://www.profightdb.com/atoz.html?term=";
var urlMid = "&start=";

tabletojson.convertUrl(,
    function(tablesAsJson) {
        var tableParsed = tablesAsJson[1];
        tableParsed.forEach(function(v) {
            delete v["Expand All"],
                delete v["Web Description"]
        });
        console.log(tableParsed[1]);
        fs.writeFile("output.json", JSON.stringify(tablesAsJson[1], null, "\t"), function(err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });

        const csv = json2csv(tablesAsJson[1], ['Name of Covered Entity', 'State', 'Covered Entity Type', 'Individuals Affected', 'Breach Submission Date', 'Type of Breach', 'Location of Breached Information', 'Business Associate Present']);

        fs.writeFile('output.csv', csv, function(err) {
            if (err) throw err;
            console.log('CSV Saved.');
        });
    }
);