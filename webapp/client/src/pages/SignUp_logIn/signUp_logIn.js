import React, { Component } from 'react'
import Icon_exit_modal from "./../../images/icon_exit_modal.svg"
import Icon_loading from "./../../images/icon_loading.svg"
import Icon_check_green from "./../../images/icon_check_green.svg"
import Icon_exit_modal_red from "./../../images/icon_exit_modal_red.svg"

import "./signUp_logIn.sass"
import "./loading.sass"

import User from "./../../api/user.js"

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
        link: "keep playing without signing in."
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

  focusIn = (field)=>{
    this.setState({
      [field+"State"]: false,
      [field+"FontColor"]: ""
    })
  }

  focusOut = (field)=>{
    if (
      this.state[field] !== ""
      && this.props.appState.signUpLogIn === "signup"
      && ["username","email"].includes(field)
    ) {
      this.setState({
        [field+"State"]: Icon_loading,
        [field+"FontColor"]: "#666"
      })
      //
      //
      // setTimeout(()=>{  // 🚨 Note out for projection (or remove after letting sit for awhile. )
        User.checkAvailable({[field]: this.state[field]})
          .then( resp => {
            if (resp.available) {
              this.setState({
                [field+"State"]: Icon_check_green,
                [field+"FontColor"]: "#51C856"
              })
            } else {
              this.setState({
                [field+"State"]: Icon_exit_modal_red,
                [field+"FontColor"]: "#A70000"
              })
            }
          })
      // },1000)
      //
      //
    } else { // the password and confirm icons don't need the api call, but leverage the in/out input state (So, here we just need to say true for that to take effect.)
      this.setState({ [field+"State"]: true })
    }
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
    let title = this.state[route].title
    if (!window.gameHasBegun) title = "Welcome to Kiss The Sky!"

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

            {title}

          </div>

          <div className="sub-title">

            {this.state[route].subTitle}

          </div>

          <div className="input-container">

            <div className="inputs-container"
              onFocus={()=>{this.focusIn("username")}}
              onBlur={()=>{this.focusOut("username")}}
            >
              <input
                name="username"
                placeholder="Username"
                spellCheck="false"
                value={this.state.username}
                onChange={this.handleInput}
                style={{color: this.state.usernameFontColor}}
              />
              {(this.props.appState.signUpLogIn === "signup"
                && this.state.usernameState
                && this.state.username !== "")  &&
                <img
                  className={"icon_loading "
                  +(this.state.usernameState === Icon_loading ? " rotate" : "")}
                  src={this.state.usernameState} alt={this.state.usernameState}
                />
              }
            </div>

            {route === "signup" && <>

              <div className="inputs-container"
                onFocus={()=>{this.focusIn("email")}}
                onBlur={()=>{this.focusOut("email")}}
              >
                <input
                  name="email"
                  placeholder="Email"
                  spellCheck="false"
                  value={this.state.email}
                  onChange={this.handleInput}
                  style={{color: this.state.emailFontColor}}
                />
                { (this.state.emailState && this.state.email !== "") &&
                  <img className={"icon_loading "
                    +(this.state.emailState === Icon_loading ? " rotate" : "")}
                    src={this.state.emailState} alt={this.state.emailState}
                  />
                }
              </div>

              <div className="inputs-container"
                onFocus={()=>{this.focusIn("password")}}
                onBlur={()=>{this.focusOut("password")}}
              >
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  spellCheck="false"
                  autoComplete="new-password"
                  value={this.state.password}
                  onChange={this.handleInput}
                />
                {(this.state.password !== "" && this.state.passwordState) &&
                  <img className="icon_loading"
                    src={
                      this.state.password.length >= 6
                      ? Icon_check_green
                      : Icon_exit_modal_red
                    }
                    alt="Password Check Icon"
                  />
                }
              </div>

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
              <div className="inputs-container"
                onFocus={()=>{this.focusIn("confirm")}}
                onBlur={()=>{this.focusOut("confirm")}}
              >
                <input
                  name="confirm"
                  type="password"
                  placeholder="Confirm Password"
                  spellCheck="false"
                  value={this.state.confirm}
                  onChange={this.handleInput}
                />
                {(this.state.confirm !== "" && this.state.confirmState) &&
                  <img className="icon_loading"
                    src={
                      (this.state.password.length >= 6
                      && this.state.password === this.state.confirm)
                      ? Icon_check_green
                      : Icon_exit_modal_red
                    }
                    alt="Password Check Icon"
                  />
                }
              </div>
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
