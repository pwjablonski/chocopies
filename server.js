// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// We're going to use the "Product Catalog and Orders" base template:
// https://airtable.com/templates/featured/expZvMLT9L6c4yeBX/product-catalog-and-orders
var Airtable = require('airtable');
var base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);
var tableName = 'Furniture';

var request = require('request');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Cache the records in case we get a lot of traffic.
// Otherwise, we'll hit Airtable's rate limit.
var cacheTimeoutMs = 5 * 1000; // Cache for 5 seconds.
var cachedResponse = null;
var cachedResponseDate = null;

app.get("/data", function (_, response) {
  if (cachedResponse && new Date() - cachedResponseDate < cacheTimeoutMs) {
    response.send(cachedResponse);
  } else {
    // Select the first 10 records in "Main View".
    base(tableName).select({
      maxRecords: 10,
      view: 'Main View',
    }).firstPage(function(error, records) {
      if (error) {
        response.send({error: error});
      } else {
        cachedResponse = {
          records: records.map(record => {
            return {
              name: record.get('Name'),
              picture: record.get('Picture'),
            };
          }),
        };
        cachedResponseDate = new Date();
        
        response.send(cachedResponse);
      }
    });
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});