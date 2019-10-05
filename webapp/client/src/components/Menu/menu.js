import React, { Component } from 'react'
import { Link } from "react-router-dom"

import Flower from "./../../components/Flower/flower.js"
import Icon_menu from './../../images/icon_menu.svg'
import Icon_menu_close from './../../images/icon_menu_close.svg'
import Logo_dark from './../../images/title_header_dark.png'
import Logo_light from './../../images/title_header_light.png'
import Resume_button from './../../images/resume_button.svg'
import Start_button from './../../images/start_button.svg'

import User from "./../../api/user.js"

import "./menu.sass"

import SignUpLogIn from "./../../pages/SignUp_logIn/signUp_logIn.js"

class Landing extends Component {

  state = {
    icon: Icon_menu,
    open: false,
    history: this.props.history,
  }

  // componentDidMount(){
  //   this.addClickToCloseEvent()
  // }

  componentWillReceiveProps(props){
    if (props.appState.openMenu && !this.state.open) {
      this.toggleMenu()
      this.setState({open: true})
      window.menuOpen = true
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

  // addClickToCloseEvent = ()=>{
  //   if (!document.body.hasOnClick) {
  //     document.body.hasOnClick = true
  //     document.body.addEventListener("click", (event) => {
  //       const path = event.composedPath()
  //       if (
  //         path.filter(e=>e.classList && e.classList.contains("noListen")).length === 0
  //         &&
  //         this.state.open
  //       ) {
  //         this.toggleMenu()
  //       }
  //     })
  //   }
  // }

  toggleSignUpLogIn = (page, hold)=>{
    this.props.appState.set({signUpLogIn: page})
    if (page && !hold) this.toggleMenu()
    page ? window.pause() : window.resume()
  }

  overrideLightModeOnDashboardScreens = () => {
    if (!this.props.appState.showGame) {
      document.body.style.background = "#202020"
      document.getElementById("logo").src = Logo_dark;
    }
  }

  resumeLightModeIfOn = () => {
    if (!window.darkMode) {
      document.body.style.background = "#FFFFFF"
      document.getElementById("logo").src = Logo_light;
    }
  }

  resumeGame = () => {
    if (window.gamePaused && window.gameHasBegun) {
      window.resume()
      this.state.history.push('/game')
      this.props.appState.set({ showGame: true })
      this.resumeLightModeIfOn()
    }
  }

  startGame = () => {
    this.state.history.push('/game')
  }

  render() {

    const routeArr = this.props.history.location.pathname.split("/")
    let route = routeArr[1] === 'leaderboard' ? 'leaderboard' : routeArr[2]
    if (!route) route = "savedsessions"
    if (this.props.appState.showGame) route = ""
    const gamePage = (routeArr[1] !== "" && routeArr[1] !== "game")
    const showIcon = this.props.appState.showIcon
    const gameHasBegun = window.gameHasBegun

    this.overrideLightModeOnDashboardScreens()

    return (
      <>
        <div className="menu">

          <img
            id="logo"
            src={Logo_dark}
            alt="logo"
            style={{
              opacity: `${(showIcon || gamePage) ? 1 : 0}`,
              pointerEvents: `${(showIcon || gamePage) ? "" : "none"}`
            }}
          />

          <div
            className="start-resume-container"
            onClick={gameHasBegun ? this.resumeGame : this.startGame}
            style={{
              opacity: `${(gamePage) ? 1 : 0}`,
              pointerEvents: `${(gamePage) ? "" : "none"}`
            }}
          >
            <img
              className="start-resume-button"
              src={gameHasBegun ? Resume_button : Start_button}
              alt="Resume Game Button"
            />
            <div className={gameHasBegun ? "resume-text" : "start-text"}>
              {gameHasBegun ? "RESUME" : "START"}
            </div>
          </div>

          {/* ⚠️ Warning: Changing 👇 this className name will effect event listener to toggle menu view/unview */}
          <div id="menu_icon_container"
            className="noListen menu-toggler"
            onClick={this.toggleMenu}>

            <svg 
              id="menu-icon-svg" 
              viewBox="0 0 100 100"
              style={{ right: `${!this.props.appState.username ? "2px" : "57px"}` }}>
              <polyline id="top-line" points="7 20 50 20 93 20 "></polyline>
              <path id="middle-line"  d="M7,50 L93,50 Z"></path>
              <path id="bottom-line"  d="M7,80 L93,80 Z"></path>
            </svg>

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
              <Link to="/dashboard/savedsessions" className="link menu-toggler" onClick={this.toggleMenu}>
                <div className={"btn "+(route === "savedsessions" ? "active" : "")}>

                  saved sessions

                </div>
              </Link>
              <Link to="/dashboard/myhighscores" className="link menu-toggler" onClick={this.toggleMenu}>
                <div className={"btn "+(route === "myhighscores" ? "active" : "")}>

                  my high scores

                </div>
              </Link>
              <Link to="/dashboard/settings" className="link menu-toggler" onClick={this.toggleMenu}>
                <div className={"btn "+(route === "settings" ? "active" : "")}>

                  settings

                </div>
              </Link>
            </>}

            <Link to="/leaderboard"
              className="link menu-toggler"
              onClick={this.toggleMenu}>
              <div className={"btn leaderboard-btn "+(route === "leaderboard" ? "active" : "")}>

                  leaderboard

              </div>
            </Link>

            <div className="divider"></div>

            {!this.props.appState.username && <>

              <div
                className="link btn menu-toggler"
                onClick={()=>{this.toggleSignUpLogIn("signup")}}>

                  sign up

              </div>

              <div
                className="link btn menu-toggler"
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


