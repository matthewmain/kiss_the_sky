import React, { Component } from 'react'
import "./game.sass"

class Home extends Component {

  componentDidMount(){
    console.log('mount')
    const game = document.getElementById("game")
    game.style.display = "block"
    game.style.opacity = 1
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
