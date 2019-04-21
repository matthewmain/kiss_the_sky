import React, { Component } from 'react'
import "./game.sass"
import $ from "jquery"

class Home extends Component {

  componentDidMount(){
    const game = document.getElementById("game")
    game.style.display = "block"
    game.style.opacity = 1
    document.addEventListener("DOMContentLoaded", function() {
      $("#loader_div").fadeOut(1500)
    })

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
