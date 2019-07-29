const db = require("../models")
const manifestController = require("./manifestController")
const mongoose = require("mongoose")
const passport = require('../passport')

const UserControllers = {

  getUser: function(req, res) {
    console.log('\n👥 👍 Attempting to get a logged in user 👍 👥')
    if (req.user) {
      db.User.findOne({_id: req.user._id})
        .then(user => {
          req.user.avatar = user.avatar
          req.user.created_at = user.created_at
          res.json({ user: req.user })
        })
        .catch(err => res.json(err))
    }
    else { res.json({ user: null }) }
  },

  logIn: function(req, res, next) {
    console.log('\n👥 📜 Attempting to log in user 📜 👥')
    console.log(' - '+(req.body && req.body.username))
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err)
      if (!user) return res.json(info)
      req.logIn(user, function(err) {
        if (err) { return next(err) }
        db.User.findOne({_id: user._id})
          .then(user => {
            const { username ,_id , avatar } = user
            return res.json({username,_id,avatar})
            res.json({ user: req.user, avatar: user.avatar })
          })
          .catch(err => res.json(err))
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
      .then(user => res.json(user) )
      .catch(err => {
        if (err.errors) {
          let errors = ""
          for (const field in err.errors) {
            const kind = err.errors[field].kind
            const message = err.errors[field].message
            // PASSWORD
            if (field === "password" && kind === "minlength") {
              errors += "This password is too Short. \n"
                +" - It must have (6) or more characters.\n\n"
            }
            //USERNAME
            else if (field === "username" && kind === 'maxlength') {
              errors += "This username 👇 is too large ☹️\n"
                +" - usernames can be no longer than 30 characters.\n\n"
            }
            // ANY Field
            else if (kind === 'unique') {
              errors += "This "+field+" 👇 is already taken☹️\n - "
                +req.body[field]+"\n\n"
            }
            else {
              errors = message
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
  },

  changeAvatar: function(req, res) {
    console.log('🌸 Change Avatar ', req.body)
    db.User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: {avatar: {colors: req.body}}}
    )
      .then(foundUser => {
        db.User.findOne({ _id: req.user._id })
          .then(user => {
            console.log(' - 🌸 Successfull avatar change ', user.avatar)
            res.json({ updatedColor: user.avatar.colors })
          })
      })
      .catch(err => res.json(err))
  }

}

module.exports = UserControllers
