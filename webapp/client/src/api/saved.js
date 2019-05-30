import API from "./API"

export default {

  saved: function(app){
    if (app.username && app._id) {
      console.log(" 👤 💾💾💾 🌺 attempting get get users savedGames 🌺 💾💾💾 👤" )
      app.set({savedGames: []})
      API.saved({
        username: app.username,
        _id: app._id,
      })
        .then( resp => {
          console.log(" - 👤 💾💾💾 🌺 savedGames :", resp.data)
          app.set({savedGames: resp.data || []})
        })
        .catch( err => console.log(err))
    }
  },

  save: function(app, title){
    window.pause()
    window.localSavedGameData = {}
    window.saveGame()
    console.log(app)
    if (app.username && app._id) {
      console.log(" 👤 💾 🌺 attempting user save 🌺 💾 👤" )
      const objGame = JSON.parse(window.localSavedGameData)
      API.save({
        username: app.username,
        manifest: {
          title: title,
          date: objGame.timeStamp,
          ambientMode: objGame.ambientMode,
          gameDifficulty: objGame.gameDifficulty,
          currentSeason: objGame.currentSeason,
          currentYear: objGame.currentYear,
          highestRedFlowerPct: objGame.highestRedFlowerPct
        },
        game: window.localSavedGameData
      })
        .then( resp => {
          alert("game saved 👍")
          window.resume()
          console.log(" - 👤 💾 🌺 save :", resp.data)
        })
        .catch( err => console.log(err))
    } else {
      app.fn("handleHash", "login")
      app.set({forceClose: true})
    }
  },

  resume: function(_id, history) {
    console.log(" 👤 💾 💥 🌺 attempting resume saved game 🌺 💥 💾 👤" )
    API.resume(_id)
      .then( resp => {
        console.log(" - 👤 💾 💥 🌺 resume saved game :", resp)
        window.resumeState(resp.data)
        history.push('/game')
      })
      .catch( err => console.log(err))
  },

  delete: function(app, saved_id, _id) {
    console.log(" 👤 📛 🌺 attempting delete saved game 🌺 📛 👤" )
    API.delete({saved_id, _id})
      .then( resp => {
        console.log(" - 👤 📛 🌺 deleted :", resp.data)
        this.saved(app)
      })
      .catch( err => console.log(err))
  },

  update: function(app, saved_id, _id, field, value) {
    console.log(" 👤 ☝️ 🌺 attempting UPDATE to saved game 🌺 ☝️ 👤" )
    API.update({saved_id, _id, field, value})
      .then( resp => {
        console.log(" - 👤 ☝️ 🌺 updated :", resp.data)
        this.saved(app)
      })
      .catch( err => console.log(err))
  }

}
