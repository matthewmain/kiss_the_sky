import API from "./API"

export default {

  winner: function(score) {
    API.winner(score)
      .then( resp => console.log(" - 🎆 🌟 👤 new winning score! :", resp.data))
      .catch( err => console.log(err))
  },

  leaderboard: function(app, difficulty, page) {
    API.leaderboard({difficulty, page})
      .then( resp => {
        console.log('\n 🌟 leaderboard 🌟 ', resp.data)
        app.set({
          leaderboard: resp.data.leaderboard,
          leaderboardRef: {difficulty, page}
        })
      })
      .catch( err => console.log(err))
  },

  myHighScores: function(app) {
    API.myHighScores()
      .then( resp => {
        console.log(" - 🌟 👤 user high scores :", resp.data)
        app.set({myHighScores: resp.data || []})
      })
      .catch( err => console.log(err))
  }

}
