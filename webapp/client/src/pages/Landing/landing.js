import React, { Component } from 'react'
import { Link } from "react-router-dom"
import Logo_header from './../../images/logo_header.svg'
import "./landing.sass"

class Landing extends Component {
  render() {
    return (
      <div className="landing">

          <div className="logo-header-container">

            <div className="logo-header" >
              <img src={Logo_header} alt="Kiss-the-sky-logo" />
            </div>

            <Link to="/home" >
              <button> DEVELOMENT MODE </button>
            </Link>

          </div>

      </div>
    )
  }
}

export default Landing
