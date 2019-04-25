import React, { Component } from 'react'
import "./leaderboard.sass"

class Leaderboard extends Component {

  componentDidMount(){
    this.props.appState.changeAppState("showGame", false)
  }

  componentWillUnmount(){
    this.props.appState.changeAppState("showGame", true)
  }

  render(){
    const route = this.props.history.location.pathname.split("/")
    return (
      <div className="leaderboard">

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
