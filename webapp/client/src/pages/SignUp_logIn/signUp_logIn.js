import React, { Component } from 'react'
import Icon_exit_modal from "./../../images/icon_exit_modal.svg"
import "./signUp_logIn.sass"

import User from "./../../utils/user.js"

class SignUp extends Component {

  state = {
    username: "",
    email: "",
    newpassword: "",
    password: "",
    confirm: "",
    signup: {
      title: "Your garden is evolving! Nice.",
      subTitle: "Sign up to save progress and track high scores.",
      button: "SIGN UP",
      routeTo: "login",
      option1: {
        message: "It's cool. I just want to ",
        link: "keep playing without signing in"
      },
      option2: {
        message: "Already a member? ",
        link: "Log in."
      }
    },
    login: {
      title: "Welcome back.",
      subTitle: "Log in to save progress and track high scores.",
      button: "LOG IN",
      routeTo: "signup",
      option1: {
        message: "",
        link: ""
      },
      option2: {
        message: "Don't have an account? ",
        link: "Sign up."
      }
    }
  }

  componentWillReceiveProps(props){
    if (props.appState.signUpLogIn) {
      if (props.appState.signUpLogIn === "signup") {
        this.setState({ username: "", email: "", password: "", confirm: "",})
      }
      window.location.hash = props.appState.signUpLogIn || ""
    }
    if (this.props.appState.signUpLogIn) {
      if (!props.appState.waitingforSession) {
        window.location.hash = props.appState.signUpLogIn || ""
      }
    }

  }

  handleInput = (events) => {
    this.setState({[events.target.name]: events.target.value})
  }

  submit = ()=>{
    if (this.props.appState.signUpLogIn === "login") {
      User.logIn(this.props.appState, this.state)
    } else {
      if (this.state.password === this.state.confirm) {
        const newUser = {...this.state}
        delete(newUser.confirm)
        User.signUp(this.props.appState, newUser)
      } else {
        alert("your PASSWORD does NOT match your CONFIRM password")
      }
    }
  }

  render(){

    const route = this.props.appState.signUpLogIn || "login"
    const toggle = route === "login" ? "signup" : "login"

    return (
      <div className="signup-login">

        <div className="signup-login-container">

          <img
            id="icon_exit_modal"
            src={Icon_exit_modal}
            alt="exit modal button"
            onClick={()=>{this.props.toggleSignUpLogIn(false)}}
          />

          <div className="title">

            {this.state[route].title}

          </div>

          <div className="sub-title">

            {this.state[route].subTitle}

          </div>

          <div className="input-container">

            <input
              name="username"
              placeholder="Username"
              spellCheck="false"
              value={this.state.username}
              onChange={this.handleInput}
            />

            {route === "signup" && <>
              <input
                name="email"
                placeholder="Email"
                spellCheck="false"
                value={this.state.email}
                onChange={this.handleInput}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                spellCheck="false"
                autoComplete="new-password"
                value={this.state.password}
                onChange={this.handleInput}
              />
            </>}

            {route === "login" &&
              <input
                name="password"
                type="password"
                placeholder="Password"
                spellCheck="false"
                value={this.state.password}
                onChange={this.handleInput}
              />
            }

            {route === "signup" &&
              <input
                name="confirm"
                type="password"
                placeholder="Confirm Password"
                spellCheck="false"
                value={this.state.confirm}
                onChange={this.handleInput}
              />
            }

          </div>

          <div className="bottom-container">
            <button className="btn" onClick={this.submit}>

              {this.state[route].button}

            </button>
            <br />
            <div className="options-container">

              <div className="keep-playing">
                {this.state[route].option1.message}
                <span className="link"
                  onClick={()=>{this.props.toggleSignUpLogIn(false, true)}}>
                  {this.state[route].option1.link}
                </span>
              </div>

              {this.state[route].option2.message}
              <span
                className="link"
                onClick={()=>{this.props.toggleSignUpLogIn(toggle, true)}}>
                {this.state[route].option2.link}
              </span>

            </div>
          </div>

        </div>

      </div>
    )
  }
}


export default SignUp
