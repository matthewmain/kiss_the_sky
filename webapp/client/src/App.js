import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom"

import API from "./utils/API"
import "./styles/app.sass"

import E404 from "./pages/E404/e404.js"
import Game from "./pages/Game/game.js"
import Dashboard from "./pages/Dashboard/dashboard.js"
import Leaderboard from "./pages/Leaderboard/leaderboard.js"
import Menu from "./components/Menu/menu.js"

class App extends Component {

  state = {
    username: null,
    _id: null,
    manifest: {},
    openMenu: false,
    waitingforSession: true,
    showGame: true,
    gameLoaded: false,
    signUpLogIn: false,
    gamePaused: false,
    appFunc: (func, params)=>{this[func](params)},
    changeAppState: (state, value)=>{ this.setState({[state]: value})}
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
        if (resp.data.user) {
          this.updateUser(resp.data.user)
        } else {
          console.log(" - 📜 No Session User Logged In")
          this.setState({waitingforSession: false})
          this.handleHash()
        }
      })
      .catch( err => console.log(err))
  }

  handleHash(){
    if (window.location.hash) {
      if (["#login", "#singin"].includes(window.location.hash)){
        console.log("!", )
        this.setState({signUpLogIn: window.location.hash.split('#')[1]})
      }
    }
  }

  updateUser = (data)=>{
    if (data.username) console.log(" - 📜 👤 User Logged In > ", data.username )
    else console.log(" - 📜 👤 User Logged Out")
    this.setState({
      username: data.username,
      _id:  data._id,
      waitingforSession: false,
      transition: "close",
      signUpLogIn: false,
    })
    if (this.state.gamePaused === "doUnpause") {
      this.togglePauseResume(false)
    }
  }

  logIn = (user)=>{
    console.log('👤 Log In: user: ', user.username)
    API.logIn(user)
      .then( resp => {
        if (resp.data._id) {
          this.updateUser(resp.data)
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
      .finally(()=>{this.setState({forceClose: true})})
  }

  togglePauseResume = (state)=>{
    if (window.gameHasBegun) {
      const togglePause = document.querySelector(".icon_game_run")
      togglePause.click()
      this.setState({gamePaused: state})
    }
  }

  render() {
    return (
      <div className="app">

        <BrowserRouter>

          <Route
            render={route => <Menu {...route}
              appState={this.state}
              logOut={this.logOut}
              logIn={this.logIn}
              signUp={this.signUp}
              updateUser={this.updateUser}
            />}
          />

          {this.state.showGame &&
            <Route
              render={route => <Game {...route}
                appState={this.state}
              />}
            />
          }

          <Switch>
            <Route exact path="/(|landing|game|home)/" // 🚨 Check in game.js if changing. the list is there too.
              render={() => <Home /> }
            />
            <Route exact path={"/dashboard("
              +"|/savedsessions"
              +"|/myhighscores"
              +"|/settings)/"}
              render={route => <Dashboard {...route}
                appState={this.state}
              />}
            />
            <Route exact path={"/leaderboard("
              +"|/beginner"
              +"|/intermediate"
              +"|/expert)/"}
              render={route => <Leaderboard {...route}
                appState={this.state}
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
