import API from "./API"

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
      if (user.username) console.log(" - 📜 👤 User Logged In > ", user.username )
      else console.log(" - 📜 👤 User Logged Out")
      app.set({
        username: user.username,
        _id:  user._id,
        waitingforSession: false,
        signUpLogIn: false
      })
      window.resume()
    },

    logIn: function(app, user){
      console.log('👤 Log In: user: ', user.username)
      API.logIn(user)
        .then( resp => {
          if (resp.data._id) {
            this.updateUser(app, resp.data)
          } else {
            alert(resp.data.message)
          }
        })
        .catch( err => console.log(err) )
    },

    signUp: function(app, newUser){
      console.log('👆 Sign UP > newUser: ', newUser)
      API.signUp(newUser)
        .then( resp => {
          if (resp.data._id) {
            this.logIn(app, newUser)
          } else {
            alert(resp.data.errors)
          }
        })
        .catch( err => console.log(err))
    },

    logOut: function(app){
      console.log('✌️ log Out: user: ', app.username)
      API.logOut()
        .then( resp => this.updateUser(app, resp.data) )
        .catch( err => console.log(err) )
        .finally( ()=>{ app.set({forceClose: true}) } )
    },

    checkAvailable: async function(field) {
      console.log('📝 Check if '+JSON.stringify(field)+' is available')
      return API.checkAvailable(field)
        .then( resp => resp.data )
        .catch( err => console.log(err) )
    }

}
