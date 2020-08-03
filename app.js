const express = require("express");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");
const { Op } = require("sequelize");
const moment = require("moment");
const ejs = require("ejs");
const db = require("./models/index.js");
const idToImageURL = require("./util/idToImageURL.js");

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

function checkHttps(req, res, next) {
  // protocol check, if http, redirect to https

  if (req.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    res.redirect("https://" + req.hostname + req.url);
  }
}

app.all("*", checkHttps);

// email
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ROUTES

app.get("/", function(request, response) {
  response.render("pages/index");
});

app.get("/comingsoon", function(request, response) {
  response.render("pages/comingsoon");
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
  response.redirect(`/?pieID=${request.params.id}&live=true`);
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

  const sentPies = await db.Pie.count({
    where: {
      senderEmail,
      sentAt: {
        [Op.gt]: moment()
          .subtract(1, "hours")
          .toDate()
      }
    }
  });
  console.log(sentPies);

  if (sentPies > 9) {
    response.send({
      error: {
        type: "too many requests",
        message:
          "You've already claimed 10 pies in the last hour. Come back later to share more pies!"
      }
    });
  } else {
    const pie = await db.Pie.update(
      {
        sentAt: moment().toDate(),
        senderName,
        senderEmail,
        recipientName,
        recipientEmail,
        message,
        subscribedSender
      },
      {
        where: { id: pieId }
      }
    );

    const imageURL = idToImageURL(pieId);
    const eatURL = `https://eatchocopietogether.com/pies/${pieId}/eat`;
    const redirectURL = `https://eatchocopietogether.com/?pieID=${pieId}`; //&live=true
    try {
      await response.send(pie);
    } catch (e) {
      console.log(e);
    }
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
      from: {
        email: "eatingchocopietogether@gmail.com",
        name: "EatChocopieTogether"
      },
      subject: `A Chocopie For You, From ${senderName}`,
      html: recipientHtml
    };

    const senderHtml = await ejs.renderFile("views/emails/sender.ejs", {
      imageURL,
      pieURL: redirectURL,
      senderName,
      recipientName,
      message
    });
    const msgSender = {
      to: senderEmail,
      from: {
        email: "eatingchocopietogether@gmail.com",
        name: "EatChocopieTogether"
      },
      fromname: "EatChocopieTogether",
      subject: `Thank you for sharing a Chocopie`,
      html: senderHtml
    };
    try {
      await sgMail.send(msgRecipient);
      await sgMail.send(msgSender);
    } catch (e) {
      console.log(e);
    }
  }
});

module.exports = app;
