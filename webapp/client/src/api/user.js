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
      if (user.username) console.log(" - 📜 👤 User Logged In > ", user )
      else console.log(" - 📜 👤 User Logged Out")
      app.set({
        username: user.username,
        _id:  user._id,
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
            this.updateUser(app, resp.data)
          } else {
            alert(resp.data.message)
          }
        })
        .catch( err => console.log(err) )
    },

    signUp: function(app, {username,password,email}){
      console.log('👆 Sign UP > newUser: ', username)
      API.signUp({username,password,email})
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
