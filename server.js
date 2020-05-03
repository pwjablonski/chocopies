const express = require("express");
const Sequelize = require("sequelize");
const Jimp = require("jimp");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Database

const pies = [
      {x:0, y:0, isClaimed:false},
      {x:1, y:0, isClaimed:false},
      {x:2, y:0, isClaimed:false}
    ];
let Pie;

// setup a new database
// using database credentials set in .env
var sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
  host: '0.0.0.0',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
    // Security note: the database is saved to the file `database.sqlite` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
  storage: '.data/database.sqlite'
});

// authenticate with the database
sequelize.authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
    // define a new table 'users'
    Pie = sequelize.define('pies', {
      x: {
        type: Sequelize.INTEGER
      },
      y: {
        type: Sequelize.INTEGER
      },
      isClaimed: {
        type: Sequelize.BOOLEAN
      }
    });
    
    setup();
  })
  .catch(function (err) {
    console.log('Unable to connect to the database: ', err);
  });

// populate table with default users
async function setup(){
  await Pie.sync({force: true})
  for(var i=0; i<pies.length; i++){ // loop through all users
    Pie.create(pies[i]); // create a new entry in the users table
  }
}

//   const image = await Jimp.read(
//     "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2Fpixil-frame-0.png?v=1588042676267"
//   );

//   const width = image.bitmap.width;
//   const height = image.bitmap.height;

//   for (var y = 0; y < height; y++) {
//     for (var x = 0; x < width; x++) {
//       var pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
//       if (!(pixel.r === 255 && pixel.g === 255 && pixel.b === 255)) {
//       }
//     }
//   }


// ROUTES

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/browse", function(request, response) {
  response.sendFile(__dirname + "/views/browse.html");
});


app.get("/pies", function(request, response) {
  var dbPies=[];
  Pie.findAll().then(function(pies) { // find all entries in the users tables
    pies.forEach(function(pie) {
      dbPies.push(pie); // adds their info to the dbUsers value
    });
    response.send(dbPies); // sends dbUsers back to the page
  });
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

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
