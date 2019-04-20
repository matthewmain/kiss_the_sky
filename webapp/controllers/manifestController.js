const db = require("../models")
const mongoose = require("mongoose")

const ManifestControllers = {

  getManifest: function(req, res) {
    console.log('\n 📜 Get manifest API attempt 📜 \n')
    db.Manifest.find( { name: "manifest" })
      .then(manifest => res.json(manifest) )
      .catch(err => res.status(422).json(err) )
  },

  incrementPage: function(req, res) {
    console.log('\n 🧮 👊 ➕➕ Increment visits attempt ➕➕ 👊 🧮 \n')
    const edits = { $inc : {visits : 1} }
    db.Manifest.findOneAndUpdate( { name: "manifest" }, edits )
      .then(manifest => res.json(manifest) )
      .catch(err => res.status(422).json(err) )
  },

  incrementUsers: function() {
    console.log('\n 🧮 👥 ➕➕ Increment users attempt ➕➕ 👥 🧮 \n')
    const edits = { $inc : {total_users : 1} }
    db.Manifest.findOneAndUpdate( { name: "manifest" }, edits )
      .then(manifest => console.log("User Count Updated") )
      .catch(err => console.log(err) )
  }

}

module.exports = ManifestControllers
