import React, { Component } from 'react'
import Winner from "./../../api/winner.js"
import Saved from "./../../api/saved.js"

import "./game.sass"

class Home extends Component {

  // state = {
  //   opacity: 1,
  //   history:
  // }
  constructor(props){
    super()
    this.state = {
      opacity: 1,
      history: props.history,
      app: props.appState
    }
  }

  componentDidMount(){
    const game = document.getElementById("game")
    game.style.display = "block"
    game.style.opacity = 1
    console.log("process.env.NODE_ENV: ", process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'development') {
      console.log("force resize window (development only)")
      window.scaleLanding()
      window.updateUI()
    }
    const route = this.props.history.location.pathname
    if ( this.props.gameLoaded
      || ["/","/game","/landing","/home"].includes(route)
    ) {
      window.requestAnimationFrame(()=>{ this.setState({opacity: 0}) })
    }
    this.props.appState.set({gameLoaded: true})
    window.createReactCallbacks(this.gameWon, this.gameSave)
  }

  componentWillUnmount(){
    const game = document.getElementById("game")
    game.style.display = "none"
  }

  gameWon = (score) => {
    score.avatar = this.props.appState.avatar
    Winner.winner(score)
  }

  gameSave = (app, history)=>{
    const title = prompt("Save Session as... (You can change this name later)", "untitled")
    if (title) Saved.save( this.state.app, this.state.history, title )
    //
    // 🔥
    console.log("\n\n\n\n - Ok, we just don't need the history, before we were going BACK to the /game because we had to go the the /menu to save. so it looked like no page was changing when really it was... - \n\n\n\n")
    // 🔥
    //
  }

  render() {
    return (
      <div className="game" style={{ opacity: `${this.state.opacity}`}}></div>
    )
  }

}

export default Home
