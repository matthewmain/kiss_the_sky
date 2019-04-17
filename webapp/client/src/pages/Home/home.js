import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "./home.sass"

class Home extends Component {

  render() {
    return (
      <div className="home">
        Raw Develoment "Home" Page
        &nbsp; ::  &nbsp;
        <span>
          <Link to="/">
            <button> Landing Page </button>
          </Link>
           &nbsp; :: &nbsp;
          <button> Game Mode </button>
          <button> Ambient Mode </button>
           &nbsp; :: &nbsp;
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
