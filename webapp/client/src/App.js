import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom"
import API from "./utils/API"

import Home from "./pages/Home/home.js"
import Landing from "./pages/Landing/landing.js"

class App extends Component {

  constructor(){
    super()
    this.state = {
      manifest: {}
    }
  }

  componentDidMount() {
    this.getManifest()
  }

  getManifest() {
    console.log("🧮 requesting manifest from API" )
    API.getManifest()
      .then( resp => {
        console.log(" - manifest :", resp.data)
        this.setState({manifest: resp.data})
      }) // 🔥 collapse ?
      .catch( err => console.log(err))
  }

  render() {
    return (
      <div className="app">

        <BrowserRouter>
          <Switch>
            <Route path="/(|landing)/"
              render={() => <Landing />}
            />
            <Route exact path="/home"
              render={() => <Home manifest={this.state.manifest} />}
            />
          </Switch>
        </BrowserRouter>

      </div>
    )
  }
}

export default App
