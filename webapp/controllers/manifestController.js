const db = require("../models")
const mongoose = require("mongoose")

const ManifestControllers = {

  incrementPage: function(req, res) {
    console.log('\n🧮 ➕➕ Increment visits attempt ➕➕ 🧮 \n\n')
    const edits = { $inc : {visits : 1} }
    db.Manifest.findOneAndUpdate( { name: "manifest" }, edits )
      .then(dbModel => {
        console.log(dbModel)
        res.json(dbModel)
      })
      .catch(err => res.status(422).json(err) )
  }

}

module.exports = ManifestControllers
