const express = require("express");
const Sequelize = require("sequelize");
const Jimp = require("jimp");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Database
let Pie;

const sequelize = new Sequelize(
  "database",
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "0.0.0.0",
    dialect: "sqlite",
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    // Security note: the database is saved to the file `database.sqlite` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
    storage: ".data/database.sqlite"
  }
);

// authenticate with the database
sequelize
  .authenticate()
  .then(function(err) {
    console.log("Connection has been established successfully.");
    // define a new table 'users'
    Pie = sequelize.define("pies", {
      x: {
        type: Sequelize.INTEGER
      },
      y: {
        type: Sequelize.INTEGER
      },
      lat: {
        type: Sequelize.FLOAT
      },
      lng: {
        type: Sequelize.FLOAT
      },
      isClaimed: {
        type: Sequelize.BOOLEAN
      }
    });

    setup();
  })
  .catch(function(err) {
    console.log("Unable to connect to the database: ", err);
  });

// populate table with default users
async function setup() {
  await Pie.sync({ force: true });

  const image = await Jimp.read(
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2Fkorea-2500.png?v=1590524307186"
  );

  const width = image.bitmap.width;
  const height = image.bitmap.height;

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
      if (!(pixel.r === 255 && pixel.g === 255 && pixel.b === 255)) {
        Pie.create({ x, y, lat: 43 - y * 0.1, lng: 124 + x * 0.15 , isClaimed: false });
      }
    }
  }
}

// email
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ROUTES

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/old", function(request, response) {
  response.sendFile(__dirname + "/views/old.html");
});

app.get("/pies", async function(request, response) {
  const data = {
    claimed: 0,
    total: 0,
    pies: []
  };
  data.claimed = await Pie.count({ where: { isClaimed: true } });
  const { count, rows } = await Pie.findAndCountAll();
  data.total = count;
  rows.forEach(function(pie) {
    data.pies.push(pie);
  });
  response.send(data);
});

app.get("/pies/:id", async function(request, response) {
  const pie = await Pie.findAll({
    where: { id: request.params.id }
  });
  response.send(pie);
});

app.post("/pies", async function(request, response) {
  const pie = await Pie.update(
    { isClaimed: true },
    {
      where: { id: request.body.pieId },
    }
  );

  response.send(pie)
  // email
  const msg = {
    to: request.body.data.recipientEmail ,
    from: "pwjablonski@gmail.com",
    subject: `Hi ${request.body.data.recipientName}!`,
    text: request.body.data.message,
    html: `<strong>${request.body.data.message}</strong>`
  };
  try {
    await sgMail.send(msg);
  } catch (e) {
    console.log(e);
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
