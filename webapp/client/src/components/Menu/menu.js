import React, { Component } from 'react'
import { Link } from "react-router-dom"
import Icon_menu from './../../images/icon_menu.svg'
import Icon_menu_close from './../../images/icon_menu_close.svg'
import Title_header_dark from './../../images/title_header_dark.svg'

import User from "./../../api/user.js"

import "./menu.sass"

import SignUpLogIn from "./../../pages/SignUp_logIn/signUp_logIn.js"

class Landing extends Component {

  state = {
    icon: Icon_menu,
    open: false,
  }

  componentDidMount(){
    console.log(this)
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

            <svg
              id="flower_avatar"
              alt="flower avatar"
              style={{
                maxWidth: `${this.props.appState.username ? "40px" : "0px"}`,
                paddingRight: `${this.props.appState.username ? "0px" : "12px"}`,
              }}
              width="43px" height="49px" viewBox="0 0 43 49" version="1.1" xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="page-header-right" transform="translate(-41.000000, -1.000000)" fillRule="nonzero">
                  <g id="header-right">
                    <g id="header-right-(logged-in,-closed)">
                      <g id="avatar" transform="translate(37.000000, 0.000000)">
                        <g id="flower-avatar" transform="translate(4.000000, 1.000000)">
                          <polygon id="hex"
                            fill={this.props.appState.avatar ? this.props.appState.avatar.colors.pistil : "#E0993E"} points="25.1 17.2 29.2 24.0996728 25.2 31 17.1 31.1 13 24.0996728 17 17.3044867"></polygon>
                          <path id="petals"
                            fill={this.props.appState.avatar ? this.props.appState.avatar.colors.petal : "#0E7FD9"} d="M17.1278935,17.3044867 C13.7293999,10.6254606 15.0510363,4.85729839 21.0928027,0 C27.134569,4.85729839 28.4562054,10.6254606 25.0577118,17.3044867 L17.1278935,17.3044867 Z M25.0577118,17.3044867 C29.2041618,11.052751 34.9134596,9.30120091 42.1856053,12.0498364 C40.955226,19.6557703 36.5675645,23.6723824 29.022621,24.0996728 L25.0577118,17.3044867 Z M29.022621,24.0996728 C36.5675645,24.5269632 40.955226,28.5435753 42.1856053,36.1495092 C34.9134596,38.8981447 29.2041618,37.1465946 25.0577118,30.8948589 L29.022621,24.0996728 Z M25.0577118,30.8948589 C28.4562054,37.573885 27.134569,43.3420472 21.0928027,48.1993456 C15.0510363,43.3420472 13.7293999,37.573885 17.1278935,30.8948589 L25.0577118,30.8948589 Z M17.1278935,30.8948589 C12.9814436,37.1465946 7.27214573,38.8981447 2.84217094e-14,36.1495092 C1.23037938,28.5435753 5.61804082,24.5269632 13.1629843,24.0996728 L17.1278935,30.8948589 Z M13.1629843,24.0996728 C5.61804082,23.6723824 1.23037938,19.6557703 1.10134124e-13,12.0498364 C7.27214573,9.30120091 12.9814436,11.052751 17.1278935,17.3044867 L13.1629843,24.0996728 Z"></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </svg>

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
