'use strict';
const tabletojson = require('tabletojson');
const fs = require('fs');
const json2csv = require('json2csv').parse;
var urlBase = "http://profightdb.com/atoz.html?term=z&start=0";

tabletojson.convertUrl(fullURL,
    function(tablesAsJson) {
        var tableParsed = tablesAsJson[0];
        console.log(tableParsed);
        fs.writeFile("output.json", JSON.stringify(tablesAsJson[0], null, "\t"), function(err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });

        const csv = json2csv(tablesAsJson[0]);

        fs.writeFile('./output.csv', csv, function(err) {
            if (err) throw err;
            console.log('CSV Saved.');
        });
    }
);