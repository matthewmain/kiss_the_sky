import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom"
import API from "./utils/API"

import E404 from "./components/E404/e404.js"
import Menu from "./components/Menu/menu.js"
import Game from "./pages/Game/game.js"
import Home from "./pages/Home/home.js"

class App extends Component {

  state = {
    username: null,
    _id: null,
    manifest: {}
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

  render() {
    return (
      <div className="app">

        <BrowserRouter>
          <Switch>
            <Route exact path="/(|landing|game)/"
              render={() => <>
                <Menu appState={this.state}/>
                <Game />
              </>}
            />
            <Route exact path="/home"
              render={() => <Home
                appState={this.state}
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

export default App
