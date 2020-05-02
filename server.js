const express = require("express");
const Sequelize = require('sequelize');
const Jimp = require("jimp");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

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
        
      }
    }
  }
  response.send("seeding complete");
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
