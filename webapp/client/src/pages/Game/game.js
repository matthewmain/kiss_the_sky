import React, { Component } from 'react'
import "./game.sass"

class Home extends Component {

  state = {
    opacity: 1,
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
    if (
      this.props.gameLoaded
      || ["/","/game","/landing","/home"].includes(route)
      // || this.props.appState.showGame
    ) {
      window.requestAnimationFrame(()=>{ this.setState({opacity: 0}) })
    }
    this.props.appState.changeAppState("gameLoaded", true)
  }

  componentWillUnmount(){
    const game = document.getElementById("game")
    game.style.display = "none"
  }

  render() {
    return (
      <div className="game" style={{ opacity: `${this.state.opacity}`}}></div>
    )
  }

}

export default Home
