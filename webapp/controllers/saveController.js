const db = require("../models")
const mongoose = require("mongoose")

const SaveControllers = {

  savedGames: function(req, res) {
    console.log('ok savedGames')
    console.log('\n👥 💾💾💾 🌺 Attempting get users saved games 🌺 💾💾💾 👥')
    db.User.findOne({_id: req.body._id})
      .then(resp => {
        console.log(" - 👥 💾💾💾  🌺 User saves new game 🌺 💾💾💾 👥\n")
        res.json(resp.saved_games)
      })
      .catch(err => res.status(422).json(err) )
  },

  saveGame: function(req, res) {
    console.log('\n👥 💾 🌺 Attempting user save 🌺 💾 👥')
    console.log(' - '+req.body.username)
    db.User.findOneAndUpdate(
      {_id: req.body._id},
      {$push: {saved_games: {data:req.body.saveObj}}
    })
      .then(resp => {
        console.log(" - 👥 💾 🌺 User saves new game 🌺 💾 👥\n")
        res.json(resp)
      })
      .catch(err => res.status(422).json(err) )

  }



}

module.exports = SaveControllers
