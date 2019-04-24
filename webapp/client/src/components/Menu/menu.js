import React, { Component } from 'react'
import { Link } from "react-router-dom"
import Icon_menu from './../../images/icon_menu.svg'
import Icon_menu_close from './../../images/icon_menu_close.svg'
import Flower_avatar from './../../images/flower_avatar.svg'

import "./menu.sass"

class Landing extends Component {

  state = {
    open: false,
    icon: Icon_menu
  }

  toggleMenu = ()=>{
    this.setState({ open: !this.state.open})
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
            src={this.state.open ? Icon_menu_close : Icon_menu }
            alt="icon menu"/>
          {this.props.appState.username &&
            <img
              id="flower_avatar"
              src={Flower_avatar}
              alt="flower avatar"
            />
          }
        </div>

        {this.state.open &&
          <div className="menu_container">

            {this.props.appState.username &&
              <div className="btn username">
                {this.props.appState.username}
              </div>
            }

            <Link to="/home" className="link" >
              <div className="btn">
                Development Home
              </div>
            </Link>

            <div className="btn" onClick={this.save}>
              Save
            </div>

          </div>
        }

      </div>
    )
  }
}

export default Landing
