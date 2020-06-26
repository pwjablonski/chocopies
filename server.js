const express = require("express");
const Sequelize = require("sequelize");
const Jimp = require("jimp");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");
const { Op } = require("sequelize");
const moment = require("moment");
const ejs = require("ejs");

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

const EAT =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-EAT.png?v=1593119005599";
const UNITE =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-UNITE.png?v=1593119006333";
const SHARE =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-SHARE.png?v=1593119006137";
const PEACE =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-PEACE.png?v=1593119005876";
const LOVE =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-LOVE.png?v=1593119005767";
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
      sentAt: {
        type: Sequelize.DATE
      },
      senderName: {
        type: Sequelize.TEXT
      },
      senderEmail: {
        type: Sequelize.TEXT
      },
      recipientName: {
        type: Sequelize.TEXT
      },
      recipientEmail: {
        type: Sequelize.TEXT
      },
      eatenAt: {
        type: Sequelize.DATE
      },
      message: {
        type: Sequelize.TEXT
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
        Pie.create({
          x,
          y,
          lat: 43 - y * 0.05,
          lng: 124 + x * 0.1
        });
      }
    }
  }
}

// email
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ROUTES

app.get("/", function(request, response) {
  response.render('pages/index');
});

app.get("/about", async function(request, response) {
  response.render("pages/about");
});

app.get("/howitworks", function(request, response) {
  response.render("pages/howitworks");
});

app.get("/triennial", function(request, response) {
  response.render("pages/triennial");
});

app.get("/terms", function(request, response) {
  response.render("pages/terms");
});

app.get("/privacy", function(request, response) {
  response.render("pages/privacy");
});

app.get("/pies", async function(request, response) {
  const data = {
    sent: 0,
    eaten: 0,
    total: 0,
    pies: []
  };
  data.sent = await Pie.count({
    where: {
      sentAt: {
        [Op.ne]: null
      }
    }
  });
  data.eaten = await Pie.count({
    where: {
      eatenAt: {
        [Op.ne]: null
      }
    }
  });
  const { count, rows } = await Pie.findAndCountAll();
  data.total = count;
  rows.forEach(function(pie) {
    data.pies.push(pie);
  });
  response.send(data);
});

app.get("/pies/:id", async function(request, response) {
  const pie = await Pie.findAll({
    where: { id: request.params.id },
    attributes: ["x", "y", "lng", "lat", "sentAt", "recipientName"]
  });
  response.send(pie);
});

app.get("/pies/:id/eat", async function(request, response) {
  const pie = await Pie.update(
    {
      eatenAt: moment().toDate()
    },
    {
      where: { id: request.params.id }
    }
  );
  response.redirect(`/?pieID=${request.params.id}`);
});

app.post("/pies", async function(request, response) {
  const {
    pieId,
    data: {
      message,
      senderName,
      senderEmail,
      recipientName,
      recipientEmail,
      sentAt
    }
  } = request.body;
  
  console.log("test-2")
  
  const sentPie = await Pie.findOne({
    where: {
      senderEmail,
      sentAt: {
        [Op.gt]: moment()
          .subtract(1, "hours")
          .toDate()
      }
    }
  });
  console.log("test-1")
  
  if (sentPie) {
    response.send({
      error: {
        type: "too many requests",
        message: "You've already claimed a pie in the last hour"
      }
    });
  } else {
    console.log("test")
    const pie = await Pie.update(
      {
        sentAt: moment().toDate(),
        senderName,
        senderEmail,
        recipientName,
        recipientEmail,
        message
      },
      {
        where: { id: pieId }
      }
    );
    
    console.log("test1")
    
    const imageURL = idToImageURL(pieId);
    const eatURL = `https://eatchocopietogether.glitch.me/pies/${pieId}/eat`;
    const redirectURL = `https://eatchocopietogether.glitch.me/?pieID=${pieId}`;
    response.send(pie);
    console.log("test2")
    // email
    const recipientHtml = await ejs.renderFile("views/emails/recipient.ejs", {
      imageURL,
      pieURL: eatURL,
      senderName,
      recipientName,
      message
    });
    const msgRecipient = {
      to: recipientEmail,
      from: "eatchocopiehelp@gmail.com",
      subject: `A Chocopie has been shared with you!`,
      html: recipientHtml
    };
    
    console.log("test3")
    
    const senderHtml = await ejs.renderFile("views/emails/sender.ejs", {
      imageURL,
      pieURL: redirectURL,
      senderName,
      recipientName,
      message
    });
    const msgSender = {
      to: senderEmail,
      from: "eatchocopiehelp@gmail.com",
      subject: `Thank you for sharing a Chocopie`,
      html: senderHtml
    };
    console.log("test4")
    try {
      await sgMail.send(msgRecipient);
      await sgMail.send(msgSender);
      console.log("test5")
    } catch (e) {
      console.log(e);
    }
  }
});

function idToImageURL(id) {
  let imageURL;
  const idModFive = id % 5;

  if (idModFive === 0) {
    imageURL = EAT;
  } else if (idModFive == 1) {
    imageURL = UNITE;
  } else if (idModFive === 2) {
    imageURL = PEACE;
  } else if (idModFive === 3) {
    imageURL = SHARE;
  } else if (idModFive === 4) {
    imageURL = LOVE;
  }
  return imageURL;
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
