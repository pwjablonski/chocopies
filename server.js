const Airtable = require("airtable");
var Jimp = require("jimp");
const express = require("express");
const bodyParser = require("body-parser");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);
const tableName = "Furniture";
const viewName = "Main View";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/browse", function(request, response) {
  response.sendFile(__dirname + "/views/browse.html");
});

app.get("/chocopie/:id", function(request, response) {
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
  response.sendFile(__dirname + "/views/chocopie.html");
});

app.get("/chocopie/:id/send", function(request, response) {
  response.sendFile(__dirname + "/views/checkout.html");
});

app.post("/chocopie", function(request, response) {
  console.log(request.body);
  response.redirect("/chocopie/" + request.body.fid);
});

app.get("/register", function(request, response) {
  response.sendFile(__dirname + "/views/register.html");
});

app.get("/about", function(request, response) {
  response.sendFile(__dirname + "/views/about.html");
});

app.get("/triennial", function(request, response) {
  response.sendFile(__dirname + "/views/triennial.html");
});

app.get("/seedPies", async function(request, response) {
  const image = await Jimp.read(
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2Fpixil-frame-0.png?v=1588042676267"
  );

  const width = image.bitmap.width;
  const height = image.bitmap.height;

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
      if (!(pixel.r === 255 && pixel.g === 255 && pixel.b === 255)) {
        base("pies").create(
          {
            xCoor: x,
            yCoor: y
          },
          function(err, record) {
            if (err) {
              console.error(err);
              return;
            }
            console.log(record.getId());
          }
        );
      }
    }
  }
  response.send("seeding complete");
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
