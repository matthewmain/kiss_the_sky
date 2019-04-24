import React, { Component } from 'react'
import "./game.sass"

class Home extends Component {

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
  }

  componentWillUnmount(){
    const game = document.getElementById("game")
    game.style.display = "none"
  }

  render() {
    return (
      <div className="game"></div>
    )
  }

}

export default Home
