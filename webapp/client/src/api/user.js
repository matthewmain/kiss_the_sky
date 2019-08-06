import API from "./API"
import Flower_Options from "./../styles/flower_options.json"

export default {

    getUser: function(app){
      console.log("📜 check for logged in session user" )
      API.getUser()
        .then( resp => {
          if (resp.data.user) {
            this.updateUser(app, resp.data.user)
          } else {
            console.log(" - 📜 No Session User Logged In")
            app.set({waitingforSession: false})
            app.fn("handleHash")
          }
        })
        .catch( err => console.log(err))
    },

    updateUser: function(app, user){
      if (user.username) console.log(" - 📜 👤 User Logged In > ", user )
      else console.log(" - 📜 👤 User Logged Out")
      app.set({
        username: user.username,
        created_at: user.created_at,
        _id:  user._id,
        avatar: user.avatar || false,
        waitingforSession: false,
        signUpLogIn: false
      })
      window.resume()
    },

    logIn: function(app, {username,password}){
      console.log('👤 Log In: user: ', username)
      API.logIn({username,password})
        .then( resp => {
          if (resp.data._id) {
            this.updateUser(app, resp.data, resp.data.avatar)
          } else {
            alert(resp.data.message)
          }
        })
        .catch( err => console.log(err) )
    },

    signUp: function(app, {username,password,email}){
      console.log('👆 Sign UP > newUser: ', username)
      const avatar = {
        colors: Flower_Options[window._rand(0,Flower_Options.length - 1)]
      }
      API.signUp({username,password,email,avatar})
        .then( resp => {
          if (resp.data._id) {
            this.logIn(app, {username,password})
          } else {
            alert(resp.data.errors)
          }
        })
        .catch( err => console.log(err))
    },

    logOut: function(app){
      console.log('✌️ log Out: user: ', app.username)
      API.logOut()
        .then( resp => {
          window.location.href = "/"
        })
        .catch( err => console.log(err) )
        .finally( ()=>{ app.set({forceClose: true}) } )
    },

    checkAvailable: async function(field) {
      console.log('📝 Check if '+JSON.stringify(field)+' is available')
      return API.checkAvailable(field)
        .then( resp => resp.data )
        .catch( err => console.log(err) )
    },

    changeAvatar: function(colors, app) {
      console.log('🌸 Change Avatar ', colors)
      API.changeAvatar(colors)
        .then( resp => {
          app.set({
            avatar: {colors: resp.data.updatedColor},
          })
        })
        .catch( err => console.log(err) )
    }

}
