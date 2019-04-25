import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom"
import API from "./utils/API"
import "./styles/app.sass"

import E404 from "./pages/E404/e404.js"
import Game from "./pages/Game/game.js"
import SignUp from "./pages/SignUp/signUp.js"
import LogIn from "./pages/LogIn/logIn.js"

import Menu from "./components/Menu/menu.js"

class App extends Component {

  state = {
    username: null,
    _id: null,
    manifest: {},
  }

  componentDidMount() {
    this.getManifest()
    this.getUser()
  }

  getManifest() {
    console.log("🧮 requesting manifest from API" )
    API.getManifest()
      .then( resp => {
        console.log(" - 🧮 manifest :", resp.data)
        this.setState({manifest: resp.data})
      })
      .catch( err => console.log(err))
  }

  getUser() {
    console.log("📜 check for logged in session user" )
    API.getUser()
      .then( resp => {
        if (resp.data.user) this.updateUser(resp.data.user)
        else console.log(" - 📜 No Session User Logged In")
      })
      .catch( err => console.log(err))
  }

  updateUser = (data)=>{
    if (data.username) console.log(" - 📜 👤 User Logged In > ", data.username )
    else console.log(" - 📜 👤 User Logged Out")
    this.setState({
      username: data.username,
      _id:  data._id
    })
  }

  logIn = (user)=>{
    console.log('👤 Log In: user: ', user.username)
    API.logIn(user)
      .then( resp => {
        if (resp.data._id) {
          this.updateUser(resp.data)
          this.setState({subPage: "manifest"})
          const last = user.history.location.pathname
          last === '/login' ? user.history.push('/') : user.history.goBack()
        } else {
          alert(resp.data.message)
        }
      })
      .catch( err => console.log(err) )
  }

  signUp = (newUser)=>{
    console.log('👆 Sign UP > newUser: ', newUser)
    API.signUp(newUser)
      .then( resp => {
        if (resp.data._id) {
          this.logIn(newUser)
          this.setState({subPage: "manifest"})
        } else {
          alert(resp.data.errors)
        }
      })
      .catch( err => console.log(err))
  }

  logOut = ()=>{
    console.log('✌️ log Out: user: ', this.state.username)
    API.logOut()
      .then( resp => this.updateUser(resp.data) )
      .catch( err => console.log(err) )
  }

  render() {
    return (
      <div className="app">

        <BrowserRouter>

          <Menu
            appState={this.state}
            logOut={this.logOut}
          />

          <Game />

          <Switch>
            <Route exact path="/(|landing|game|home)/"
              render={() => <Home /> }
            />
            <Route exact path="/signup"
              render={route => <SignUp
                {...route}
                appState={this.state}
                signUp={this.signUp}
                updateUser={this.updateUser}
              />}
            />
            <Route exact path="/login"
              render={route => <LogIn
                {...route}
                appState={this.state}
                logIn={this.logIn}
                updateUser={this.updateUser}
              />}
            />
            <Route path="*" render={() => <E404 appState={this.state}/> }/>
          </Switch>
        </BrowserRouter>

      </div>
    )
  }
}

function Home(){ return ( <></> ) } // Yes. this is weired. But, we need a placeholder for the main page which is essentailly has no content. NOT a page. This will save the endpoints '/' 'home' 'landing' etc. OTHERWISE we'll get the 404 error.  

export default App
