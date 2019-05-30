import React, { Component } from 'react'
import { Link } from "react-router-dom"
import moment from "moment"
import "./leaderboard.sass"

import Winner from "./../../api/winner.js"

class Leaderboard extends Component {

  state = {
    opacity: 0
  }

  componentDidMount(){
    this.props.appState.set({showGame: false})
    window.requestAnimationFrame(()=>{ this.setState({opacity: 1}) })
    window.pause()
    const route = this.props.history.location.pathname.split("/")
    if (!route[2]) route[2] = "expert"
    Winner.leaderboard(
      this.props.appState,
      route[2],
      this.props.appState.leaderboardRef.page
    )
  }

  toggledDifficulty = (difficulty)=>{
    const page = 1
    Winner.leaderboard(this.props.appState, difficulty, page)
  }

  componentWillUnmount(){
    this.props.appState.set({showGame: true})
  }

  paginate(way){
    Winner.leaderboard(
      this.props.appState,
      this.props.appState.leaderboardRef.difficulty,
      this.props.appState.leaderboardRef.page + (way === "left" ? -1 : 1)
    )
  }

  render(){
    const route = this.props.history.location.pathname.split("/")
    if (!route[2]) route[2] = "expert"
    return (
      <div className="leaderboard" style={{ opacity: `${this.state.opacity}`}}>

        <div className="leaderboard-header">
          Leaderboard
          <div className="leaderboard-subtitle">
            All-Time High Scores
          </div>
        </div>

        <br/><br/><br/><br/>

        <Link to="/leaderboard/beginner"
          className={"diff-btn "+(route[2] === "beginner" ? "active" : "")}
          onClick={()=>this.toggledDifficulty("beginner")}>
          Beginner
        </Link>
        &nbsp; &nbsp;
        <Link to="/leaderboard/intermediate"
          className={"diff-btn "+(route[2] === "intermediate" ? "active" : "")}
          onClick={()=>this.toggledDifficulty("intermediate")}>
          Intermediate
        </Link>
        &nbsp; &nbsp;
        <Link to="/leaderboard/expert"
          className={"diff-btn "+(route[2] === "expert" ? "active" : "")}
          onClick={()=>this.toggledDifficulty("expert")}>
          Expert
        </Link>

        <hr/>

        {this.props.appState.leaderboard.length > 0 && <> {
          this.props.appState.leaderboard.map((score,index)=>
          <div className="details-container" key={index}>

              {index+((this.props.appState.leaderboardRef.page - 1) * 10)+1}.

              <div style={{width: 300, display: "inline-block"}}>
                &nbsp; {score.username}
              </div>

              {moment(score.date, 'YYYY-MM-DD').format('M/D/YY')}

              <div style={{float: "right"}}>
                {score.years} years
              </div>

          </div>)
        } </> }

        {this.props.appState.leaderboardRef.page > 1 &&

          <button className="diff-btn"
            onClick={()=>this.paginate("left")}>

            &#x2190;

          </button>

        }

        &nbsp; &nbsp; &nbsp;

        {this.props.appState.leaderboard.length > 9 &&
          <button className="diff-btn"
            onClick={()=>this.paginate("right")}>

            &#x2192;

          </button>
        }

      </div>
    )
  }
}

export default Leaderboard
