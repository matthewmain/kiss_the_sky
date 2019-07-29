import axios from "axios"

export default {

  // 🧮 Admin
  getManifest: function() {
    return axios.put("/api/manifest")
  },

  // 👥 User
  getUser: function(){
    return axios.get("/api/user")
  },
  logIn: function(user){
    return axios.post("/api/user", user)
  },
  logOut: function(){
    return axios.get("/api/user/logout")
  },
  signUp: function(newUser){
    return axios.post("/api/user/signup", newUser)
  },
  checkAvailable: function(field){
    return axios.post("/api/user/checkavailable", field)
  },
  changeAvatar: function(color){
    return axios.put("/api/user/changeAvatar", color)
  },

  // 💾 🌺
  saved: function(user){
    return axios.post("/api/saved", user)
  },
  save: function(saveObj){
    return axios.put("/api/saved", saveObj)
  },
  resume: function(_id) {
    return axios.post("/api/saved/resume", {_id})
  },
  delete: function(ids) {
    return axios.post("/api/saved/delete", ids)
  },
  update: function(ids) {
    return axios.put("/api/saved/update", ids)
  },

  // ⭐️
  winner: function(score) {
    return axios.post("/api/winner", score)
  },
  leaderboard: function({difficulty, page}) {
    return axios.get("/api/winner/leaderboard/"+difficulty+"/"+page)
  },
  myHighScores: function(user) {
    return axios.get("/api/winner/myhighscores")
  }

}
