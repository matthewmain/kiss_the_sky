import React, { Component } from 'react'
import moment from "moment"
import "./dashboard.sass"

import Saved from "./../../api/saved.js"

class Dashboard extends Component {

  state = {
    opacity: 0,
    history: this.props.history
  }

  componentDidMount(){
    this.props.appState.set({showGame: false})
    window.requestAnimationFrame(()=>{ this.setState({opacity: 1}) })
    window.pause()
    this.checkForSavedGames()
  }

  componentWillUnmount(){
    this.props.appState.set({showGame: true})
  }

  componentDidUpdate(){
    if (!this.props.appState.username && !this.props.appState.waitingforSession) {
      this.state.history.push('/')
    } else if (this.props.appState.username && !this.props.appState.savedGames) {
      this.checkForSavedGames()
    }
  }

  checkForSavedGames = ()=>{
    if (
      this.props.history.location.pathname === "/dashboard/savedsessions"
      && this.props.appState.username
    ) {
      Saved.saved(this.props.appState)
    }
  }

  resume = (index)=>{
    Saved.resume(
      this.props.appState.savedGames[index].saved_id,
      this.state.history
    )
  }

  update = (index)=>{
    const currentTitle = this.props.appState.savedGames[index].title
    const newTitle = prompt('Change Saved Session title.', currentTitle)
    if (newTitle) {
      Saved.update(
        this.props.appState,
        this.props.appState.savedGames[index].saved_id,
        this.props.appState.savedGames[index]._id,
        "title",
        newTitle
      )
    } else { console.log("cancel update")}
  }

  delete = (index)=>{
    const title = this.props.appState.savedGames[index].title
    if (window.confirm('Are you sure you want to delete "'+title+'"?')) {
      Saved.delete(
        this.props.appState,
        this.props.appState.savedGames[index].saved_id,
        this.props.appState.savedGames[index]._id
      )
    } else { console.log('cancel delete') }
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

        {this.props.appState.savedGames.length > 0 && <>

          {
            this.props.appState.savedGames.map((game,index)=>
            <div className="saved-container" key={index}>

              <button
                className="title-container"
                onClick={()=>this.update(index)}
              > ✎ </button>

              <button
                className="details-container"
                onClick={()=>this.resume(index)}
              >
                &nbsp; {game.title} &nbsp;| &nbsp;

                {moment(this.props.appState.savedGames[0].date, 'YYYY-MM-DD').format('M/D/YY')} &nbsp;| &nbsp;

                {game.ambientMode ? "Ambient Mode" : "Game Mode" }
                &nbsp;({window._cap(game.gameDifficulty)}, {Math.floor(game.highestRedFlowerPct)}%) &nbsp;|&nbsp;

                Year {game.currentYear}, {game.currentSeason}

              </button>

              &nbsp;
              <button onClick={()=>this.delete(index)}>X</button>
            </div>)
          }
        </>}

      </div>
    )
  }
}

export default Dashboard
