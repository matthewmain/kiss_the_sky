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

  // 💾 🌺
  savedGames: function(user){
    return axios.post("/api/save", user)
  },
  saveGame: function(saveObj){
    return axios.put("/api/save", saveObj)
  },

}
