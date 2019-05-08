import API from "./API"

export default {

  savedGames: function(app){
    if (app.username && app._id) {
      console.log(" 👤 💾💾💾 🌺 attempting get get users savedGames 🌺 💾💾💾 👤" )
      app.set({savedGames: []})
      API.savedGames({
        username: app.username,
        _id: app._id,
      })
        .then( resp => {
          console.log(" - 🌺 savedGames :", resp.data)
          app.set({savedGames: resp.data})
        })
        .catch( err => console.log(err))
    } else {
      console.log('please log in...')
    }
  },

  saveGame: function(app, history){
    window.pause()
    window.saveGame()
    if (app.username && app._id) {
      console.log(" 👤 💾 🌺 attempting user save 🌺 💾 👤" )
      API.saveGame({
        username: app.username,
        _id: app._id,
        saveObj: window.localSavedGameData
      })
        .then( resp => {
          alert("game saved 👍")
          window.resume()
          app.set({forceClose: true})
          console.log(" - 🌺 save :", resp.data)
        })
        .catch( err => console.log(err))
    } else {
      app.fn("handleHash", "login")
      app.set({forceClose: true})
      window.pause()
    }
  }

}
