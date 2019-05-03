import React, { Component } from 'react'
import "./dashboard.sass"

class Dashboard extends Component {

  state = {
    opacity: 0,
    history: this.props.history
  }

  componentDidMount(){
    this.props.appState.changeAppState("showGame", false)
    window.requestAnimationFrame(()=>{ this.setState({opacity: 1}) })
    if (!this.props.appState.gamePaused) {
      this.props.appState.appFunc("togglePauseResume", true)
    }
  }

  componentWillUnmount(){
    this.props.appState.changeAppState("showGame", true)
  }

  componentDidUpdate(){
    if (!this.props.appState.username && !this.props.appState.waitingforSession) {
      this.state.history.push('/')
    }
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

        <br/><br/><br/><br/><br/><br/>

        {route[2] === "savedsessions" && <>
          Saved Sessions
        </>}

        {(!route[2] || route[2] === "myhighscores") && <>
          My High Scores
        </>}

        {route[2] === "settings" && <>
          Settings
        </>}

      </div>
    )
  }
}

export default Dashboard
