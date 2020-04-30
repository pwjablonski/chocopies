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

app.get("/browse", function(request, response) {
  response.sendFile(__dirname + "/views/browse.html");
});

app.get("/chocopie/:id", function(request, response) {
  response.sendFile(__dirname + "/views/chocopie.html");
});

app.get("/chocopie/:id/send", function(request, response) {
  response.sendFile(__dirname + "/views/checkout.html");
});

app.post("/chocopie", function(request, response) {
  console.log(response.params)
  response.redirect('/chocopie');
});

// app.post("/chocopie", function(request, response) {
//   response.sendFile(__dirname + "/views/confirmation.html");
// });


app.get("/register", function(request, response) {
  response.sendFile(__dirname + "/views/register.html");
});

app.get("/about", function(request, response) {
  response.sendFile(__dirname + "/views/about.html");
});


app.get("/triennial", function(request, response) {
  response.sendFile(__dirname + "/views/triennial.html");
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
