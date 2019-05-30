import React, { Component } from 'react'
import moment from "moment"
import "./dashboard.sass"

import Saved from "./../../api/saved.js"

import MyHighScores from "./../../components/MyHighScores/myHighScores.js"

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

        <br/><br/><br/><br/>

        {(!route[2] || route[2] === "savedsessions") && <>

          Saved Sessions

          {this.props.appState.savedGames.length > 0 && <>
            {this.props.appState.savedGames.map((game,index)=>
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

                  {moment(game.date, 'YYYY-MM-DD').format('M/D/YY')} &nbsp;| &nbsp;

                  {game.ambientMode ? "Ambient Mode" : "Game Mode" }
                  &nbsp;({window._cap(game.gameDifficulty)}, {Math.floor(game.highestRedFlowerPct)}%) &nbsp;|&nbsp;

                  Year {game.currentYear}, {game.currentSeason}

                </button>

                &nbsp;
                <button onClick={()=>this.delete(index)}>X</button>
              </div>)
            }
          </>}

          {this.props.appState.savedGames.length <= 0 && <>
            <br/>
            ... no saved sessions ...
          </>}

        </>}

        {route[2] === "myhighscores" && <>

          <MyHighScores
            appState={this.props.appState}
            viewMyScores={this.state.viewMyScores}
          />

        </>}

        {route[2] === "settings" && <>
          Settings
        </>}

      </div>
    )
  }
}

export default Dashboard
