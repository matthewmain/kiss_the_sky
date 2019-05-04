import React, { Component } from 'react'
import "./dashboard.sass"

import Save from "./../../utils/save.js"

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
      Save.savedGames(this.props.appState)
    }
  }

  resume = (index)=>{
    window.resumeState(this.props.appState.savedGames[index].data)
    this.state.history.push('/game')
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

        {this.props.appState.savedGames &&
          <div>
            WE GOT GAMES<br />
            {
              this.props.appState.savedGames.map((game,index)=>
              <div key={index}>
                <button onClick={()=>this.resume(index)}> Game #{index}</button> <br />
              </div>)
            }
          </div>
        }

      </div>
    )
  }
}

export default Dashboard
