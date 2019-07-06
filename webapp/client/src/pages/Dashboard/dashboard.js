import React, { Component } from 'react'
import "./dashboard.sass"

import Saved from "./../../api/saved.js"

import SavedSessions from "./../../components/SavedSessions/savedSessions.js"
import MyHighScores from "./../../components/MyHighScores/myHighScores.js"
import Settings from "./../../components/Settings/settings.js"


class Dashboard extends Component {

  state = {
    opacity: 0,
    history: this.props.history,
    route: "",
  }

  componentDidMount(){
    this.props.appState.set({showGame: false})
    window.requestAnimationFrame(()=>{ this.setState({opacity: 1}) })
    window.pause()
  }

  componentWillUnmount(){
    this.props.appState.set({showGame: true})
  }

  componentDidUpdate(){
    const route = this.state.history.location.pathname.split('/')[2]
    if (!this.props.appState.username && !this.props.appState.waitingforSession) {
      this.state.history.push('/')
    } else if (this.props.appState.username && route !== this.state.route) {
      // 🔥 COMPONENTIZE
      if (route === "savedsessions") {
        this.checkForSavedGames()
      }
      // 🔥 COMPONENTIZE
      else if (route === "settings") {
        console.log('get settings stuff... if needed')
      }
      this.setState({ route: route || "savedsessions" })
    }
  }

  checkForSavedGames = ()=>{
    Saved.saved(this.props.appState)
  }

  render(){
    const route = this.props.history.location.pathname.split("/")

    return (
      <div className="dashboard" style={{ opacity: `${this.state.opacity}`}}>

        <div className="dashboard-header">
          {this.props.appState.username}
          <div className="dashboard-subtitle">
            ... put member since here...
          </div>
        </div>

        <br/><br/><br/><br/>

        {(!route[2] || route[2] === "savedsessions") && <>

          <SavedSessions
            appState={this.props.appState}
            history={this.state.history}
          />

        </>}

        {route[2] === "myhighscores" && <>

          <MyHighScores
            appState={this.props.appState}
            viewMyScores={this.state.viewMyScores}
          />

        </>}

        {route[2] === "settings" && <>

          <Settings
            appState={this.props.appState}
          />

        </>}

      </div>
    )
  }
}

export default Dashboard
