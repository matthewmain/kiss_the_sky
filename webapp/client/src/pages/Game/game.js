import React, { Component } from 'react'
import Winner from "./../../api/winner.js"
import Saved from "./../../api/saved.js"

import "./game.sass"

class Home extends Component {

  state = {
    opacity: 1,
  }

  componentDidMount(){
    const game = document.getElementById("game")
    game.style.display = "block"
    game.style.opacity = 1
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
    window.createReactCallbacks(this.gameWon, this.gameSave, this.toggleIcon)
  }

  componentWillUnmount(){
    const game = document.getElementById("game")
    game.style.display = "none"
  }

  gameWon = (score) => {
    score.avatar = this.props.appState.avatar
    Winner.winner(score)
  }

  gameSave = ()=>{
    console.log(this.props.appState)
    if (this.props.appState.username) {
      const title = prompt("Save Session as... (You can change this name later)", "untitled")
      if (title) Saved.save( this.props.appState, title )
    } else {
      alert("Please log in to save.")
    }
  }

  toggleIcon = ()=>{
    this.props.appState.set({showIcon: true})
  }

  render() {
    return (
      <div className="game" style={{ opacity: `${this.state.opacity}`}}></div>
    )
  }

}

export default Home
