import React, { Component } from 'react'
import { Link } from "react-router-dom"

import Flower from "./../../components/Flower/flower.js"
import Icon_menu from './../../images/icon_menu.svg'
import Icon_menu_close from './../../images/icon_menu_close.svg'
import Title_header_dark from './../../images/title_header_dark.svg'
import Resume_button from './../../images/resume_button.svg'

import User from "./../../api/user.js"

import "./menu.sass"

import SignUpLogIn from "./../../pages/SignUp_logIn/signUp_logIn.js"

class Landing extends Component {

  state = {
    icon: Icon_menu,
    open: false,
    history: this.props.history,
  }

  componentDidMount(){
    console.log(this.props.history, this.state.history)
    this.addClickToCloseEvent()
  }

  componentWillReceiveProps(props){
    if (props.appState.openMenu && !this.state.open) {
      this.toggleMenu()
      this.setState({open: true})
    }
    if (props.appState.forceClose) {
      this.toggleMenu()
      this.props.appState.set({forceClose: false})
    }
  }

  toggleMenu = ()=>{
    this.props.appState.set({openMenu: !this.state.open})
    this.setState({
      open: !this.state.open
    })
  }

  addClickToCloseEvent = ()=>{
    if (!document.body.hasOnClick) {
      document.body.hasOnClick = true
      document.body.addEventListener("click", (event)=>{
        if (
          event.path.filter(e=>e.classList && e.classList.contains("noListen")).length === 0
          && this.state.open
        ) {
          this.toggleMenu()
        }
      })
    }
  }

  toggleSignUpLogIn = (page, hold)=>{
    this.props.appState.set({signUpLogIn: page})
    if (page && !hold) this.toggleMenu()
    page ? window.pause() : window.resume()
  }

  resumeGame = () => {
    if (window.gamePaused && window.gameHasBegun) {
      window.resume()
      this.state.history.push('/game')
    }
  }

  render() {

    const routeArr = this.props.history.location.pathname.split("/")
    let route = routeArr[1] === 'leaderboard' ? 'leaderboard' : routeArr[2]
    if (!route) route = "savedsessions"
    if (this.props.appState.showGame) route = ""

    return (
      <>
        <div className="menu">

          <Link to="/">
            <img
              id="title_header_dark"
              src={Title_header_dark}
              alt="title header dark"
              style={{
                opacity: `${(this.props.appState.showIcon || (routeArr[1] !== "" && routeArr[1] !== "game")) ? 1 : 0}`,
                pointerEvents: `${(this.props.appState.showIcon || (routeArr[1] !== "" && routeArr[1] !== "game")) ? "" : "none"}`
              }}
            />
          </Link>

          <div
            className="resume-container"
            onClick={this.resumeGame}
            style={{
              opacity: `${(window.gameHasBegun && routeArr[1] !== "" && routeArr[1] !== "game") ? 1 : 0}`,
              pointerEvents: `${(window.gameHasBegun && routeArr[1] !== "" && routeArr[1] !== "game") ? "" : "none"}`
            }}
          >
            <img
              id="resume_button"
              src={Resume_button}
              alt="Resume Game Button"
            />
            <div className="resume-text"> RESUME </div>
          </div>

          {/* ⚠️ Warning: Changing 👇 this className name will effect event listener to toggle menu view/unview */}
          <div id="menu_icon_container"
            className="noListen"
            onClick={this.toggleMenu}>

            <div className="toggle_menu_container">
              <img
                id="menu_icon_closed"
                className="menu_icons"
                src={Icon_menu_close}
                alt="icon menu"
                style={{
                  opacity: `${this.state.open ? 1 : 0}`,
                  right: `${!this.props.appState.username ? "2px" : "57px"}`,
                }}/>

              <img
                id="menu_icon"
                className="menu_icons"
                src={Icon_menu}
                alt="icon menu"
                style={{
                  opacity: `${this.state.open ? 0 : 1}`,
                  right: `${!this.props.appState.username ? "2px" : "57px"}`,
                }}/>
            </div>

            <div className="flower-avatar-container">
              <Flower
                hide={!this.props.appState.username}
                colors={this.props.appState.avatar.colors}
                size={40}
                appState={this.props.appState}
              ></Flower>
            </div>

          </div>

          {/* ⚠️ Warning: Changing 👇 this className name will effect event listener to toggle menu view/unview */}
          <div id="menu_dropdown_container"
            className="noListen"
            style={{
              opacity: `${this.state.open ? 1 : 0}`,
              pointerEvents: `${this.state.open ? "" : "none"}`
            }}
          >

            {this.props.appState.username && <>
              <div className="username">
                {this.props.appState.username}
              </div>
              <Link to="/dashboard/savedsessions" className="link" onClick={this.toggleMenu}>
                <div className={"btn "+(route === "savedsessions" ? "active" : "")}>

                  saved sessions

                </div>
              </Link>
              <Link to="/dashboard/myhighscores" className="link" onClick={this.toggleMenu}>
                <div className={"btn "+(route === "myhighscores" ? "active" : "")}>

                  my high scores

                </div>
              </Link>
              <Link to="/dashboard/settings" className="link" onClick={this.toggleMenu}>
                <div className={"btn "+(route === "settings" ? "active" : "")}>

                  settings

                </div>
              </Link>
            </>}

            <Link to="/leaderboard"
              className="link"
              onClick={this.toggleMenu}>
              <div className={"btn leaderboard-btn "+(route === "leaderboard" ? "active" : "")}>

                  leaderboard

              </div>
            </Link>

            {!this.props.appState.showGame &&
              <Link to="/game"
                className="link"
                onClick={this.toggleMenu}>
                <div className="btn gamemode-btn">

                    game mode

                </div>
              </Link>
            }

            {!this.props.appState.username && <>

              <div
                className="link btn"
                onClick={()=>{this.toggleSignUpLogIn("signup")}}>

                  sign up

              </div>

              <div
                className="link btn"
                onClick={()=>{this.toggleSignUpLogIn("login")}}>

                log in

              </div>

            </>}

            {this.props.appState.username &&
              <div className="btn" onClick={()=>{User.logOut(this.props.appState)}}>

                log out

              </div>
            }

          </div>
        </div>

        <div className="signUpLogIn-container" style={{
          opacity: `${this.props.appState.signUpLogIn ? 1 : 0}`,
          pointerEvents: `${this.props.appState.signUpLogIn ? "" : "none"}`
        }}>
          <SignUpLogIn
            toggleSignUpLogIn={this.toggleSignUpLogIn}
            appState={this.props.appState}
          />
        </div>

      </>
    )
  }
}

export default Landing
