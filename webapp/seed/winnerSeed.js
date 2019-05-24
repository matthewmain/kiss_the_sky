const db = require("../models")
const bcrypt = require("bcryptjs")

const Winner = {

  seedWinners: (seedLogger, next)=>{
    const usernames = [
      "Endicott64",
      "thebodhisattva",
      "scooby",
      "PappasOnPromNight",
      "carnubaWaxxx",
      "Grommet_and_die",
      "JUtah88",
      "richardMNixon",
      "WARCHILD666",
      "dev",
      "ReferenceError",
    ]
    db.User.find({username: { $in: usernames }})
      .then(resp => {
        const winners = []
        let difficulty = "beginner"
        let count = 50
        for (var i = 0; i < usernames.length; i++) {
          if (i === 4) {
            difficulty = "intermediate"
            count = 55
          }
          if (i === 7) {
            difficulty = "expert"
            count = 60
          }
          resp.forEach((user,j)=>{
            count += Math.random() * 2
            winners.push({
              avatar: user.avatar,
              username: user.username,
              difficulty: difficulty,
              date: new Date().toISOString(),
              years:parseFloat((count.toFixed(2))),
              user: user._id
            })
          })
        }
        db.Winner
          .deleteMany({})
          .then(() => db.Winner.insertMany(winners) )
          .then(resp => {
            let count = 0
            resp.map((user,i)=>{
              user.winner_id = user._id
              db.User.updateMany(
                {_id: user.user},
                {$push: {scores: user}}
              ).then(s=>{
                count++
                if (count >= resp.length) {
                  seedLogger(resp.length+" winners Updated", next)
                }
              })
              .catch(err => { console.error(err); process.exit(1); } )
            })
          })
          .catch(err => { console.error(err); process.exit(1); } )
        })
        .catch(err => { console.error(err); process.exit(1); } )

  }

}

module.exports = Winner
