import React, { Component } from 'react'
import { Link } from "react-router-dom"
import API from "./../../utils/API"
import Icon_menu from './../../images/icon_menu.svg'
import Icon_menu_close from './../../images/icon_menu_close.svg'
import Flower_avatar from './../../images/flower_avatar.svg'
import Title_header_dark from './../../images/title_header_dark.svg'

import "./menu.sass"

class Landing extends Component {

  state = {
    icon: Icon_menu,
    open: false,
    pointerEvents: "none",
    opacity: 0
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
      pointerEvents: this.state.pointerEvents === "none" ? "" : "none",
      opacity: this.state.opacity > 0.5 ? 0 : 1,
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

  save = ()=>{
    const saveObj = window.save()
    console.log("saveObj :", saveObj)
    if (this.props.appState.username && this.props.appState._id) {
      console.log(" 👤 💾 🌺 attempting user save 🌺 💾 👤" )
      API.save({
        username: this.props.appState.username,
        _id: this.props.appState._id,
        saveObj: saveObj
      })
        .then( resp => {
          console.log(" - 🌺 save :", resp.data)
        })
        .catch( err => console.log(err))
    } else {
      console.log('please log in...')
    }
  }

  render() {

    const routeArr = this.props.history.location.pathname.split("/")
    let route = routeArr[1] === 'leaderboard' ? 'leaderboard' : routeArr[2]
    if (!route) route = "myhighscores"
    if (this.props.appState.showGame) route = ""

    return (
      <div className="menu">

        {!this.props.appState.showGame &&
          <Link to="/">
            <img
              id="title_header_dark"
              src={Title_header_dark}
              alt="title header dark"
            />
          </Link>
        }

        {/* ⚠️ Warning: Changing 👇 this className name will effect event listener to toggle menu view/unview */}
        <div id="menu_icon_container"
          className="noListen"
          onClick={this.toggleMenu}>
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

        {/* ⚠️ Warning: Changing 👇 this className name will effect event listener to toggle menu view/unview */}
        <div id="menu_dropdown_container"
          className="noListen"
          style={{
            opacity: `${this.state.opacity}`,
            pointerEvents: `${this.state.pointerEvents}`
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

            <Link to="/signup"
              className="link"
              onClick={this.toggleMenu}>
              <div className="btn">

                sign up

              </div>
            </Link>

            <Link to="/login"
              className="link"
              onClick={this.toggleMenu}>
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
