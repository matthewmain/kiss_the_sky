import React, { Component } from 'react'
import moment from "moment"
import "./savedSessions.sass"

import Saved from "./../../api/saved.js"

class SavedSessions extends Component {

  resume = (index)=>{
    console.log(this)
    Saved.resume(
      this.props.appState.savedGames[index].saved_id,
      this.props.history
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
    return (
      <div className="savedSessions">

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

      </div>
    )
  }
}

export default SavedSessions
