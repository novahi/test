require("dotenv").config()

const path = require("path")

const express = require("express")

const handlebars = require("express-handlebars")

const passport = require("passport")

const FacebookStrategy = require("passport-facebook").Strategy

const route = require("./routes")

const app = express()

const port = process.env.PORT || 3000

let token

// Use static folder

app.use(express.static(path.join(__dirname, "public")))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

// Template engine

app.engine(

    "hbs",

    handlebars({

        extname: ".hbs",

        helpers: {

          sum: (a,b) => {return a+b} 

     }

    }),

)

app.set("view engine", "hbs")

app.set("views", path.join(__dirname, "resrc", "views"))

passport.use(new FacebookStrategy({

    clientID: process.env.APP_ID_FACEBOOK,

    clientSecret: process.env.APP_SECRET_FACEBOOK,

    callbackURL: "https://gamevuive.herokuapp.com/auth/facebook/sercets",

    profileFields: ["id", "displayName", "photos", "email"]

  },

  function(accessToken, refreshToken, profile, cb) {

    token = accessToken

    User.findOrCreate({ facebookId: profile.id }, function(err, user) {

      return cb(err, user);

    });

  }

));

// Routes init

route(app)

app.get("/auth/facebook",

  passport.authenticate("facebook"));

app.get("/auth/facebook/callback",

  passport.authenticate("facebook", { failureRedirect: "/login" }),

  function(req, res) {

    // Successful authentication, redirect home.

    res.redirect("/games");

  });

console.log(token)

app.listen(port, () =>

    console.log(`App listening at http://localhost:${port} with: ${__dirname}`),

)

