import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "./game.sass"

class Home extends Component {

  componentDidMount(){
    const game = document.getElementById("game")
    game.style.display = "block"
    game.style.opacity = 1
  }

  componentWillUnmount(){
    const game = document.getElementById("game")
    game.style.display = "none"
  }

  save(){
    alert('Handle Save PlaceHolder')
    console.log("Handle Save Here")
  }

  render() {
    return (
      <div className="game">
        <Link to="/home">
          <button> Home </button>
        </Link>
        &nbsp;
        <button onClick={this.save}> Save </button>

      </div>
    )
  }

}

export default Home
