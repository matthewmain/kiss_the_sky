const db = require("../models")
const manifestController = require("./manifestController")
const mongoose = require("mongoose")
const passport = require('../passport')

const UserControllers = {

  getUser: function(req, res) {
    console.log('\n👥 👍 Attempting to get a logged in user 👍 👥')
    console.log(" - " + req.user.username + "\n")
    if (req.user) { res.json({ user: req.user }) }
    else { res.json({ user: null }) }
  },

  logIn: function(req, res, next) {
    console.log('\n👥 📜 Attempting to log in user 📜 👥')
    console.log(' - '+req.body.username)
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err)
      if (!user) return res.json(info)
      req.logIn(user, function(err) {
        if (err) { return next(err) }
        return res.json({username,_id} = user)
      })
    })(req, res, next)
  },

  logOut: function(req, res) {
    console.log('\n👥 👋 Attempting to log out user 👋 👥')
    console.log(" - " + req.user + "\n")
    if (req.user) {
      req.logout()
      res.send({ message: 'Successfully logged out' })
    } else {
      res.send({ message: 'no user to log out' })
    }
  },

  signUp: function(req, res) {
    console.log('\n👥 🌱 Attempting to sign up a new user 🌱 👥')
    console.log(' - '+req.body.username)
    db.User.create(req.body)
      .then(user => {
        res.json(user)
        manifestController.incrementUsers()
      })
      .catch(err => {
        if (err.errors) {
          let errors = ""
          for (const val in err.errors) {
            if (val === "password") {
              errors += "This password is too Short. \n"
                +"It must have (6) or more characters.\n\n"
            } else {
              errors += "This "+val+" 👇 is already taken☹️\n - "
                +req.body[val]+"\n\n"
            }
          }
          res.json({errors})
        } else {
          res.status(422).json(err)
        }
      })
  },

  checkAvailable: function(req, res) {
    console.log('\n👥 📝 Checking if '+JSON.stringify(req.body)+' is available 📝 👥')
    const field = Object.keys(req.body)[0]
    db.User.findOne(req.body)
      .then(user=> {
        if (user) {
          res.json({ available: false, field: field, value: req.body[field] })
        } else {
          res.json({ available: true, field: field, value: req.body[field] })
        }
      })
      .catch(err => res.json(err))
  }

}

module.exports = UserControllers
