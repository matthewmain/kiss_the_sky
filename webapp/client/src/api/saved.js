import API from "./API"

export default {

  saved: function(app){
    app.set({savedGames: []})
    API.saved()
      .then( resp => {
        console.log(" - 👤 💾💾💾 🌺 savedGames :", resp.data)
        app.set({savedGames: resp.data || []})
      })
      .catch( err => console.log(err))
  },

  save: function(app, title){
    window.pause()
    window.localSavedGameData = {}
    window.saveGame()
    if (app.username && app._id) {
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
    API.resume(_id)
      .then( resp => {
        console.log(" - 👤 💾 💥 🌺 resume saved game :", resp)
        window.resumeState(resp.data)
        history.push('/game')
        setTimeout(function(){ // This is a hacky production patch attempt
          const headerItem = Array.from(document.querySelectorAll(".header_item"))
          headerItem.map(i=>i.style.display = "block")
        },10)
      })
      .catch( err => console.log(err))
  },

  delete: function(app, saved_id, _id) {
    API.delete({saved_id, _id})
      .then( resp => {
        console.log(" - 👤 📛 🌺 deleted :", resp.data)
        this.saved(app)
      })
      .catch( err => console.log(err))
  },

  update: function(app, saved_id, _id, field, value) {
    API.update({saved_id, _id, field, value})
      .then( resp => {
        console.log(" - 👤 ☝️ 🌺 updated :", resp.data)
        this.saved(app)
      })
      .catch( err => console.log(err))
  }

}
