import React, { Component } from 'react'
import { Link } from "react-router-dom"
import Icon_menu from './../../images/icon_menu.svg'
import Icon_menu_close from './../../images/icon_menu_close.svg'
import Flower_avatar from './../../images/flower_avatar.svg'
import Title_header_dark from './../../images/title_header_dark.svg'

import "./menu.sass"

import SignUpLogIn from "./../../pages/SignUp_logIn/signUp_logIn.js"

class Landing extends Component {

  state = {
    icon: Icon_menu,
    open: false,
  }

  componentDidMount(){
    this.addClickToCloseEvent()
  }

  componentWillReceiveProps(){
    if (this.props.appState.openMenu && !this.state.open) {
      this.toggleMenu()
      this.setState({open: true})
    }
  }

  toggleMenu = ()=>{
    this.props.appState.changeAppState("openMenu", !this.state.open)
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
    this.props.appState.changeAppState("signUpLogIn", page)
    if (page && !hold) this.toggleMenu()
    if (!page && this.props.appState.gamePaused === "doUnpause") {
      this.props.appState.appFunc("togglePauseResume", false)
    }
  }

  save(){
    alert('Handle Save PlaceHolder')
    console.log("Handle Save Here")
  }

  render() {

    const routeArr = this.props.history.location.pathname.split("/")
    let route = routeArr[1] === 'leaderboard' ? 'leaderboard' : routeArr[2]
    if (!route) route = "myhighscores"
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
                opacity: `${this.props.appState.showGame ? 0 : 1}`,
                pointerEvents: `${this.props.appState.showGame ? "none" : ""}`
              }}
            />
          </Link>

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

            <img
              id="flower_avatar"
              src={Flower_avatar}
              alt="flower avatar"
              style={{
                maxWidth: `${this.props.appState.username ? "40px" : "0px"}`,
                paddingTop: `${this.props.appState.username ? "0px" : "20px"}`,
                paddingRight: `${this.props.appState.username ? "0px" : "12px"}`,
              }}
            />

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
              <div className="btn" onClick={()=>{this.props.logOut()}}>

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
            signUp={this.props.signUp}
            logIn={this.props.logIn}
            history={this.props.history}
          />
        </div>

      </>
    )
  }
}

export default Landing
