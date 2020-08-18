const express = require("express");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");
const { Op } = require("sequelize");
const moment = require("moment");
const ejs = require("ejs");
const db = require("./models/index.js");
const idToImageURL = require("./util/idToImageURL.js");
const { body } = require("express-validator");

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const cookieSession = require('cookie-session');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://eatchocopietogether.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile)
       done(null, profile);
       // db.User.findOrCreate({ googleId: profile.id }, function (err, user) {
       //   return done(err, user);
       // });
  }
));

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
    done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
    console.log(req.user)
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
// cookieSession config
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere']
}));

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

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


app.get('/login', 
  function(req, res) {
    res.redirect('/auth/google');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/manage');
  });

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

app.get("/manage", isUserAuthenticated, function(request, response) {
  response.render("pages/manage");
});

app.get("/privacy", async function(request, response) {
  // db.Pie.update({eatenAt:null, sentAt:null, senderName: null, senderEmail:null, recipientName: null, recipientEmail: null, subscribedSender: null, message:null}, {where:{id:1}})
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
  const { recipientEmail = "No Email" } = request.query;
  const { id } = request.params;

  const pie = await db.Pie.findOne({
    where: { id, recipientEmail, eatenAt: null }
  });

  if (pie) {
    const {
      dataValues: { recipientName, senderName, senderEmail }
    } = pie;

    await db.Pie.update(
      {
        eatenAt: moment().toDate()
      },
      {
        where: { id }
      }
    );

    const notificationHtml = await ejs.renderFile(
      "views/emails/notification.ejs",
      {
        senderName,
        recipientName
      }
    );
    const msgNotification = {
      to: senderEmail,
      from: {
        email: "eatingchocopietogether@gmail.com",
        name: "EatChocopieTogether"
      },
      fromname: "EatChocopieTogether",
      subject: `${recipientName} Has Eaten The Chocopie You Shared`,
      html: notificationHtml
    };
    await sgMail.send(msgNotification);
  }

  response.redirect(`/?pieID=${id}`); //&live=true
});


app.post("/pies/:id/eatWithoutNotification", async function(request, response) {
  const { id } = request.params;

  const pie = await db.Pie.findOne({
    where: { id, eatenAt: null }
  });
  console.log(pie)
//   if (pie) {
//     const {
//       dataValues: { recipientName, senderName, senderEmail }
//     } = pie;

//     await db.Pie.update(
//       {
//         eatenAt: moment().toDate()
//       },
//       {
//         where: { id }
//       }
//     );
//   }

  await response.send(pie);
});


app.post("/pies/:id/sendReminder", async function(request, response) {
  const { id } = request.params;

  const pie = await db.Pie.findOne({
    where: { id, eatenAt: null }
  });

  if (pie) {
    const {
      dataValues: { recipientEmail, recipientName, senderName, senderEmail, message }
    } = pie;
   const imageURL = idToImageURL(id);
   const eatURL = `https://eatchocopietogether.com/pies/${id}/eat?recipientEmail=${recipientEmail}`;
      const recipientHtml = await ejs.renderFile("views/emails/recipient.ejs", {
        imageURL,
        pieURL: eatURL,
        senderName,
        recipientName,
        message
      });
      const msgRecipient = {
        to: recipientEmail,
        //cc: senderEmail,
        from: {
          email: "eatingchocopietogether@gmail.com",
          name: "EatChocopieTogether"
        },
        subject: `A Chocopie From ${senderName}`,
        html: recipientHtml
      };
    await sgMail.send(msgRecipient);
  }

  response.redirect(`/manage`); //&live=true
});

app.post(
  "/pies",
  [
    body("senderEmail")
      .isEmail()
      .normalizeEmail(),
    body("recipientEmail")
      .isEmail()
      .normalizeEmail(),
    body("senderName")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body("recipientName")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body("message")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body("subscribedSender").toBoolean()
  ],
  async function(request, response) {
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

    if (sentPies > 29) {
      response.send({
        error: {
          type: "too many requests",
          message:
            "You've shared too many Chocopies in the last hour. Please come back later!"
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
          // message,
          subscribedSender
        },
        {
          where: { id: pieId }
        }
      );

      const imageURL = idToImageURL(pieId);
      const eatURL = `https://eatchocopietogether.com/pies/${pieId}/eat?recipientEmail=${recipientEmail}`;
      const redirectURL = `https://eatchocopietogether.com/?pieID=${pieId}`; //&live=true
      try {
        console.log('send-before')
        await response.send(pie);
        console.log('send-after')
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
        //cc: senderEmail,
        from: {
          email: "eatingchocopietogether@gmail.com",
          name: "EatChocopieTogether"
        },
        subject: `A Chocopie From ${senderName}`,
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
      
      
      const testSender = {
        to: "ins-1qq4d1rl@isnotspam.com",
        from: {
          email: "artist@eatchocopietogether.com",
          name: "EatChocopieTogether"
        },
        fromname: "EatChocopieTogether",
        subject: `Thank you for sharing a Chocopie`,
        html: senderHtml
      };
      
      
      try {
        await sgMail.send(msgRecipient);
        await sgMail.send(msgSender);
        // await sgMail.send(testSender);
      } catch (e) {
        console.log(e);
        console.log(e.response);
        console.log(e.response.body);
        console.log(e.response.body.errors);
      }
    }
  }
);

module.exports = app;
