const express = require("express");
const Sequelize = require("sequelize");
const Jimp = require("jimp");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");
const { Op } = require("sequelize");
const moment = require("moment");
const ejs = require("ejs");
const db = require('./models/index.js');
const idToImageURL = require('./util/idToImageURL.js');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


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

app.get("/shop", function(request, response) {
  response.render("pages/shop");
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
  data.sent = await db.Pie.count({
    where: {
      sentAt: {
        [Op.ne]: null
      }
    }
  });
  data.eaten = await db.Pie.count({
    where: {
      eatenAt: {
        [Op.ne]: null
      }
    }
  });
  const { count, rows } = await db.Pie.findAndCountAll();
  data.total = count;
  rows.forEach(function(pie) {
    data.pies.push(pie);
  });
  response.send(data);
});

app.get("/pies/:id", async function(request, response) {
  const pie = await db.Pie.findAll({
    where: { id: request.params.id },
    attributes: ["x", "y", "lng", "lat", "sentAt", "recipientName"]
  });
  response.send(pie);
});

app.get("/pies/:id/eat", async function(request, response) {
  const pie = await db.Pie.update(
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
      sentAt,
      subscribedSender
    }
  } = request.body;
  
  console.log("test-2")
  
  const sentPie = await db.Pie.findOne({
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
    const pie = await db.Pie.update(
      {
        sentAt: moment().toDate(),
        senderName,
        senderEmail,
        recipientName,
        recipientEmail,
        message,
        subscribedSender,
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
      from: "eatingchocopietogether@gmail.com",
      subject: `${recipientName} - A Chocopie has been shared with you!`,
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
      from: "eatingchocopietogether@gmail.com",
      subject: `Thank you for sharing a Chocopie - ${senderName}`,
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

module.exports = app;