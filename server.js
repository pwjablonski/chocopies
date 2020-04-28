var Jimp = require("jimp");
var Airtable = require("airtable");
var base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);
var tableName = "Furniture";
var viewName = "Main View";

var express = require("express");
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/register", function(request, response) {
  response.sendFile(__dirname + "/views/register.html");
});

app.get("/checkout", function(request, response) {
  response.sendFile(__dirname + "/views/checkout.html");
});

app.get("/pixels", function(request, response) {
  Jimp.read(
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2Fpixil-frame-0.png?v=1588042676267"
  )
    .then(image => {
      var width = image.bitmap.width;
      var height = image.bitmap.height;
      var pixels = [];
      var count = 0;
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          var pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
          // pixels.push(`${pixel.r}, ${pixel.g}, ${pixel.b}`);
          if (!(pixel.r === 255 && pixel.g === 255 && pixel.b === 255)) {
            count++
            pixels.push({
              x,
              y,
              r: pixel.r,
              g: pixel.g,
              b: pixel.b
            });
          }
        }
      }
      response.send({ count: count, data: pixels });
      // fs.writeFile('output.json', JSON.stringify({ data: pixels }), 'utf8', (err) => {
      //     if (err) { throw err; }
      // });
    })
    .catch(err => {
      throw err;
    });
});

app.get("/pies", function(request, response) {
  base("pies")
    .select({
      maxRecords: 10,
      view: "Grid view"
    })
    .firstPage(function(error, records) {
      if (error) {
        response.send({ error: error });
      } else {
        response.send(records);
      }
    });
});

// Cache the records in case we get a lot of traffic.
// Otherwise, we'll hit Airtable's rate limit.
var cacheTimeoutMs = 5 * 1000; // Cache for 5 seconds.
var cachedResponse = null;
var cachedResponseDate = null;

app.get("/data", function(_, response) {
  if (cachedResponse && new Date() - cachedResponseDate < cacheTimeoutMs) {
    response.send(cachedResponse);
  } else {
    // Select the first 10 records from the view.
    base(tableName)
      .select({
        maxRecords: 10,
        view: viewName
      })
      .firstPage(function(error, records) {
        if (error) {
          response.send({ error: error });
        } else {
          cachedResponse = {
            records: records.map(record => {
              return {
                name: record.get("Name"),
                picture: record.get("Picture")
              };
            })
          };
          cachedResponseDate = new Date();

          response.send(cachedResponse);
        }
      });
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
