import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "./home.sass"

class Home extends Component {

  render() {
    return (
      <div className="home">
        Raw Develoment "Home" Page ::
        <span>
          <Link to="/">
            <button> Landing Page </button>
          </Link>
          ::
          <button> Game Mode </button>
          <button> Ambient Mode </button>
          ::
          <button> Sign In </button>
          <button> Sign Up </button>
        </span>
        <hr />
        Total Site Visits: {this.props.manifest.visits}
        <br />
        Total Users: {this.props.manifest.users || "none"}
        <br />
        <br />

      </div>
    )
  }

}

export default Home
