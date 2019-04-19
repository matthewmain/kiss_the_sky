const db = require("../models")
const mongoose = require("mongoose")

const ManifestControllers = {

  getManifest: function(req, res) {
    console.log('\n 📜 Get manifest API attempt 📜 \n')
    db.Manifest.find( { name: "manifest" })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err) )
  },

  incrementPage: function(req, res) {
    console.log('\n 🧮 ➕➕ Increment visits attempt ➕➕ 🧮 \n')
    const edits = { $inc : {visits : 1} }
    db.Manifest.findOneAndUpdate( { name: "manifest" }, edits )
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err) )
  }

}

module.exports = ManifestControllers
