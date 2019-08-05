import React, { Component } from 'react'
import moment from "moment"
import Icon_exit_modal_black from "./../../images/icon_exit_modal_black.svg"
import Edit_icon from "./../../images/edit_icon.svg"

import "./savedSessions.sass"

import Saved from "./../../api/saved.js"

class SavedSessions extends Component {

  componentDidMount(){
    this.checkForSavedGames()
  }

  checkForSavedGames = ()=>{
    Saved.saved(this.props.appState)
  }

  resume = (index)=>{
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

        {this.props.appState.savedGames.length > 0 &&
          this.props.appState.savedGames.map((game,index)=>{

            const date = moment(game.date, 'YYYY-MM-DD').format('M/D/YY').replace(/0/g,"O")

            return (<div className="saved-container" key={index}>

              <table>
                <tbody>
                  <tr>

                    <th
                      className="details"
                      onClick={()=>this.resume(index)}
                    >
                      <div className="title" title={game.title}>
                        {game.title.replace(/0/g,"O")}
                      </div>

                      <div className="date">
                        {date}
                      </div>

                      <div className="mode">
                        { game.ambientMode ? "Ambient Mode" : "Game Mode (" + window._cap(game.gameDifficulty) + ", " + Math.floor(game.highestRedFlowerPct).toString().replace(/0/g,"O") + "%)" }
                      </div>

                      <div className="year">
                        Year {game.currentYear.toString().replace(/0/g,"O")}, {game.currentSeason}
                      </div>

                    </th>

                    <th
                      className="icons-container"
                      onClick={()=>this.update(index)}
                    >
                      <div className="icons">
                        <img
                          className="edit"
                          src={Edit_icon}
                          alt="edit icon"
                        />
                      </div>
                    </th>

                    <th
                      className="icons-container"
                      onClick={()=>this.delete(index)}
                    >
                      <div className="icons">
                        <img
                          className="exit"
                          src={Icon_exit_modal_black}
                          alt="delete saved session button"
                        />
                      </div>

                    </th>

                  </tr>
                </tbody>
              </table>

            </div>

        )})}

        {this.props.appState.savedGames.length <= 0 && <>
          <div className="no-saved-sessions"> ... no saved sessions ... </div>
        </>}

      </div>
    )
  }
}

export default SavedSessions
