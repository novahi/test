
const path = require("path")
const express = require("express")
const handlebars = require("express-handlebars")
const route = require("./routes")
const app = express()
const port = process.env.PORT || 3000


app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Template engine
app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        helpers: {
            sum: (a, b) => { return a + b }
        }
    }),
)

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "resrc", "views"))

// Routes init

route(app)
app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
)