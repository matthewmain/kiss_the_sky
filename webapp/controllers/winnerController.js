const db = require("../models")
const mongoose = require("mongoose")

const WinnerControllers = {

  winners: function(req, res) {
    console.log('\n ⭐️🌟 Attempting to get all winners list 🌟⭐️ ')
    db.Winner.find({})
      .then(resp=>{
        const condensed = resp.map((x,i)=>{
          const winner = resp[resp.length-i-1]
          return winner.difficulty+" - "+winner.years+" - "+winner.username
        })
        res.json({ total_games_won: resp.length, condensed_scores: condensed })
      })
      .catch(err => res.status(422).json(err) )
  },

  winner: function(req, res) {
    console.log('\n ⭐️ Attempting save winner ⭐️ ')
    req.body.username = req.user.username
    req.body.user = req.user._id
    db.Winner.create(req.body)
      .then(resp => {
        console.log("resp :", resp)
        resp.winner_id = resp._id
        db.User.findOneAndUpdate(
          {_id: req.body.user},
          {$push: {scores: resp}}
        )
          .then(() => {
            res.json({ message: 'Successfully saved winning game' })
          })
          .catch(err => res.status(422).json(err) )

      })
      .catch(err => res.status(422).json(err) )
  },

  leaderboard: function(req, res,) {
    console.log('\n 🌟 Attempting to get leaderboard 🌟 ')
    if (typeof req.params.difficulty === "undefined") req.params.difficulty = "expert"
    if (typeof req.params.page === "undefined") req.params.page = 1
    const skip = (req.params.page - 1) * 10
    db.Winner.find(
      {difficulty: req.params.difficulty},
      {avatar: 1, username: 1, date: 1, years: 1, difficulty: 1},
      { skip: skip, limit: 10, sort: {years: 1} }
    )
      .then(leaderboard=>{
        const condensed = leaderboard.map(w=>{
          return w.difficulty+" - "+w.years+" - "+w.username
        })
        res.json({condensed,leaderboard})
      })
      .catch(err => res.status(422).json(err) )
  }

}

module.exports = WinnerControllers
