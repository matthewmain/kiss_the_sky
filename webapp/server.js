const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes")
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport = require("./passport")
const app = express()

const PORT = process.env.PORT || 3004

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"))
}

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/kts",
  { useNewUrlParser: true }
)

const dbConnection = mongoose.connection

app.use(
	session({
		secret: 'fraggle-rock',
		store: new MongoStore({ mongooseConnection: dbConnection }),
		resave: false,
		saveUninitialized: false
	})
)

app.use(passport.initialize())
app.use(passport.session())

app.use(routes)

app.listen(PORT, function() {
  console.log(`🌋  API Server on PORT: ${PORT} 🏡`)
})
