import React, { Component } from 'react'
import { Link } from "react-router-dom"
import API from "../../utils/API.js"
import "./home.sass"

import SignUp from "../../components/SignUp/signUp.js"
import LogIn from "../../components/LogIn/logIn.js"

class Home extends Component {

  state = {
    subPage: "manifest",
  }

  changeSubPage(subPage) {
    this.setState({subPage})
  }

  logIn = (user)=>{
    console.log('👤 Log In: user: ', user.username)
    API.logIn(user)
      .then( resp => {
        if (resp.data._id) {
          this.props.updateUser(resp.data)
          this.setState({subPage: "manifest"})
        } else {
          alert(resp.data.message)
        }
      })
      .catch( err => console.log(err) )
  }

  signUp = (newUser)=>{
    console.log('👆 Sign UP > newUser: ', newUser)
    API.signUp(newUser)
      .then( resp => {
        if (resp.data._id) {
          this.logIn(newUser)
          this.setState({subPage: "manifest"})
        } else {
          alert(resp.data.errors)
        }
      })
      .catch( err => console.log(err))
  }

  logOut(){
    console.log('✌️ log Out: user: ', this.props.appState.username)
    API.logOut()
      .then( resp => this.props.updateUser(resp.data) )
      .catch( err => console.log(err) )
  }

  render() {
    return (
      <div className="home">

        Raw Develoment "Home" Page

        &nbsp; :: &nbsp;
        <Link to="/game">
          <button> Game </button>
        </Link>

        &nbsp; :: &nbsp;
        {!this.props.appState._id && <>
          <button onClick={()=>{this.changeSubPage("login")}}> Log In </button>
          <button onClick={()=>{this.changeSubPage("signup")}}> Sign Up </button>
        </>}

        {this.props.appState._id && <>
          <button onClick={()=>{this.logOut()}}> Log Out </button>
          &nbsp; Logged In as &nbsp;
          <span style={{fontSize: 22}}> ({this.props.appState.username}) </span>
        </>}

        {this.state.subPage !== 'manifest' && <>
          &nbsp; :: &nbsp;
          <button onClick={()=>{this.changeSubPage("manifest")}}> Home </button>
        </>}

        {this.state.subPage === 'manifest' && <>
          <hr />
          Total Site Visits: {this.props.appState.manifest.visits} <br />
          Total Users: {this.props.appState.manifest.total_users || "none"}
        </>}

        {this.state.subPage === 'signup' && <>
          <hr />
          <SignUp
            signUp={this.signUp}
          />
        </>}

        {this.state.subPage === 'login' && <>
          <hr />
          <LogIn
            logIn={this.logIn}
          />
        </>}

      </div>
    )
  }

}

export default Home
