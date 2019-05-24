const db = require("../models")
const bcrypt = require("bcryptjs")

const game1 = require("./savedGames/about_to_win_game.json")
const game2 = require("./savedGames/floating_seed.json")

const Saved = {

  seedSaved: (seedLogger, next)=>{
    db.User.findOne({username: "dev"},{_Id: 1})
    .then(resp=> {
      const games = [
        game1,
        game2
      ]
      const saved = []
      games.forEach(game=>{
        saved.push({
          game: JSON.stringify(game),
          username: "dev",
          manifest: {
            title: "Seeded Game",
            date: new Date().toISOString(),
            ambientMode: game.ambientMode,
            gameDifficulty: game.gameDifficulty,
            currentSeason: game.currentSeason,
            currentYear: game.currentYear,
            highestRedFlowerPct: game.highestRedFlowerPct,
            size: "lets run a test here... keep as object",
          },
          user: resp._id
        })
      })
      db.Saved
        .deleteMany({})
        .then(() => db.Saved.insertMany(saved) )
        .then(resp => {
          let count = 0
          resp.map((game,i)=>{
            game.manifest.saved_id = game._id
            db.User.updateMany(
              {_id: game.user},
              {$push: {saved: game.manifest}}
            ).then(s=>{
              count++
              if (count >= resp.length) {
                seedLogger(resp.length+" Saveds Updated", next)
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

module.exports = Saved
