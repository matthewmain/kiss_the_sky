import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom"

import User from "./api/user.js"
import Manifest from "./api/manifest.js"

import E404 from "./pages/E404/e404.js"
import Game from "./pages/Game/game.js"
import Dashboard from "./pages/Dashboard/dashboard.js"
import Leaderboard from "./pages/Leaderboard/leaderboard.js"
import Menu from "./components/Menu/menu.js"

class App extends Component {

  state = {
    manifest: {},
    username: null,
    _id: null,
    avatar: false,
    created_at: false,
    savedGames: false,
    myHighScores: false,
    showIcon: false,
    leaderboardRef: { difficulty: "expert", page: 1},
    leaderboard: [],
    openMenu: false,
    waitingforSession: true,
    showGame: true,
    gameLoaded: false,
    signUpLogIn: false,
    fn: (func, params)=>{this[func](params)},
    set: (params)=>{ this.setState(params)}
  }

  componentDidMount() {
    window.scaleLanding(); // Deployment needs this for public to load start screen
    window.updateUI(); // Deployment needs this for public to load start screen
    Manifest.getManifest(this.state)
    User.getUser(this.state)
  }

  handleHash(hashGiven){
    if (hashGiven) {
      this.setState({signUpLogIn: hashGiven})
    } else if (window.location.hash) {
      if (["#login", "#signup"].includes(window.location.hash)){
        this.setState({signUpLogIn: window.location.hash.split('#')[1]})
      }
    }
  }

  render() {
    return (
      <div className="app">

        <BrowserRouter>

          <Route
            render={route => <Menu {...route}
              appState={this.state}
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
