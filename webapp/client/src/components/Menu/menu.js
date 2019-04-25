import React, { Component } from 'react'
import { Link } from "react-router-dom"
import Icon_menu from './../../images/icon_menu.svg'
import Icon_menu_close from './../../images/icon_menu_close.svg'
import Flower_avatar from './../../images/flower_avatar.svg'
// import Title_header_dark from './../../images/title_header_dark.svg'

import "./menu.sass"

class Landing extends Component {

  state = {
    icon: Icon_menu,
    active: "", // "savedSessions" "myHighScores" "settings"
    pointerEvents: "none",
    opacity: 0
  }

  toggleMenu = ()=>{
    this.setState({
      pointerEvents: this.state.pointerEvents === "none" ? "" : "none",
      opacity: this.state.opacity > 0.5 ? 0 : 1
    })
  }

  save(){
    alert('Handle Save PlaceHolder')
    console.log("Handle Save Here")
  }

  render() {
    return (
      <div className="menu">

        <div id="menu_icon_container" onClick={this.toggleMenu}>
          <img
            id="menu_icon"
            src={this.state.pointerEvents === "none" ? Icon_menu : Icon_menu_close  }
            alt="icon menu"/>
          {this.props.appState.username &&
            <img
              id="flower_avatar"
              src={Flower_avatar}
              alt="flower avatar"
            />
          }
        </div>

        <div
          className="menu_container"
          style={{
            opacity: `${this.state.opacity}`,
            pointerEvents: `${this.state.pointerEvents}`
          }}>

          {this.props.appState.username && <>

            <div className="username">
              {this.props.appState.username}
            </div>

            <div className={"btn "+(this.state.active === "savedSessions" ? "active" : "")}>

              saved sessions

            </div>
            <div className={"btn "+(this.state.active === "myHighScores" ? "active" : "")}>

              my high scores

            </div>
            <div className={"btn "+(this.state.active === "settings" ? "active" : "")}>

              settings

            </div>

          </>}

          <div className="btn leaderboard">

            leaderboard

          </div>

          {!this.props.appState.username && <>

            <Link to="/signup" className="link" >
              <div className="btn">

                sign up

              </div>
            </Link>

            <Link to="/login" className="link" >
              <div className="btn">

                log in

              </div>
            </Link>

          </>}

          {this.props.appState.username &&
            <div className="btn" onClick={()=>{this.props.logOut()}}>

              log out

            </div>
          }

          <hr/>

          <div className="btn" onClick={this.save}>

            Save

          </div>

        </div>

      </div>
    )
  }
}

export default Landing
