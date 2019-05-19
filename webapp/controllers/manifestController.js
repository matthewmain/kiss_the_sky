const db = require("../models")
const mongoose = require("mongoose")

const ManifestControllers = {

  getManifest: function(req, res) {
    console.log('\n 📜 Get manifest API attempt 📜 \n')
    db.Manifest.findOne({ name: "manifest" })
      .then(resp => { db.Saved.countDocuments()
        .then(saveds => { db.User.countDocuments()
          .then (users => {
            const manifest = {...resp}._doc
            manifest.saved = saveds
            manifest.users = users
            manifest.userList = "http://"+req.headers.host+"/api/manifest/userList"
            res.json(manifest)
          })
        })
      })
      .catch(err => res.status(422).json(err) )
  },

  incrementPage: function(req, res) {
    console.log('\n 🧮 👊 ➕➕ Increment visits attempt ➕➕ 👊 🧮 \n')
    const edits = { $inc : {visits : 1} }
    db.Manifest.findOneAndUpdate( { name: "manifest" }, edits )
      .then(resp=> res.json({fullManifest: "http://"+req.headers.host+"/api/manifest"}))
      .catch(err=> res.status(422).json(err) )
  },

  userList: function(req, res) {
    console.log('\n 👥👥👥 get list of all users attempt 👥👥👥 \n')
    db.User.find({}, {"username": 1, "_id": 0, "saved": 1})
      .then(users => {
        res.json(users.map(u=>{
          return {
            username: u.username,
            saved: u.saved.length,
            profile: "http://"+req.headers.host+"/api/manifest/user/"+u.username
          }
        }))
      })
      .catch(err => console.log(err) )
  },

  user: function(req, res) {
    console.log('\n 👥 Increment users attempt 👥 \n')
    console.log(req.params.username)
    db.User.findOne({username: req.params.username})
      .then(users => res.json(users) )
      .catch(err => console.log(err) )
  },

}

module.exports = ManifestControllers
