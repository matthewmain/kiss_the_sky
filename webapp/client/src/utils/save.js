import API from "./API"

export default {

  saveGame: function(app){
    window.icon_save.click()

    if (app.username && app._id) {
      console.log(" 👤 💾 🌺 attempting user save 🌺 💾 👤" )
      API.save({
        username: app.username,
        _id: app._id,
        saveObj: window.savedGameData
      })
        .then( resp => {
          console.log(" - 🌺 save :", resp.data)
        })
        .catch( err => console.log(err))
    } else {
      console.log('please log in...')
    }
  }

}
