require("dotenv").config()
<<<<<<< HEAD
const path = require("path")
const express = require("express")
const handlebars = require("express-handlebars")
const passport = require("passport")
const FacebookStrategy = require("passport-facebook").Strategy
=======

const path = require("path")

const express = require("express")

const handlebars = require("express-handlebars")

const passport = require("passport")

const FacebookStrategy = require("passport-facebook").Strategy

>>>>>>> 7bfff9c676f078687b3f91d412311b47cdf2171d
const route = require("./routes")
const app = express()

const port = process.env.PORT || 3000

<<<<<<< HEAD

// Use static folder
app.use(express.static(path.join(__dirname, "public")))
=======
let token

// Use static folder

app.use(express.static(path.join(__dirname, "public")))

>>>>>>> 7bfff9c676f078687b3f91d412311b47cdf2171d
app.use(express.json())

app.use(express.urlencoded({ extended: true }))

// Template engine

app.engine(
<<<<<<< HEAD
    "hbs",
    handlebars({
        extname: ".hbs",
=======

    "hbs",

    handlebars({

        extname: ".hbs",

>>>>>>> 7bfff9c676f078687b3f91d412311b47cdf2171d
        helpers: {

          sum: (a,b) => {return a+b} 

     }

    }),

)
<<<<<<< HEAD
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "resrc", "views"))

=======

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
>>>>>>> 7bfff9c676f078687b3f91d412311b47cdf2171d

// Routes init

route(app)

<<<<<<< HEAD
app.listen(port, () =>
    console.log(`http://localhost:${port} `),
=======
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

>>>>>>> 7bfff9c676f078687b3f91d412311b47cdf2171d
)

