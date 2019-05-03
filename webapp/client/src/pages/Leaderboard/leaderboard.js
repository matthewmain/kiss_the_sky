import React, { Component } from 'react'
import "./leaderboard.sass"

class Leaderboard extends Component {

  state = {
    opacity: 0
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

  render(){
    const route = this.props.history.location.pathname.split("/")
    return (
      <div className="leaderboard" style={{ opacity: `${this.state.opacity}`}}>

        <div className="leaderboard-header">
          Leaderboard
          <div className="leaderboard-subtitle">
            All-Time High Scores
          </div>
        </div>

        <br/><br/><br/><br/><br/><br/>

        {route[2] === "beginner" && <>
          Beginner
        </>}

        {route[2] === "intermediate" && <>
          Intermediate
        </>}

        {(!route[2] || route[2] === "expert") && <>
          Expert
        </>}

      </div>
    )
  }
}

export default Leaderboard
