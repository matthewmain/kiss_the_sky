import React, { Component } from 'react'
import { Link } from "react-router-dom"
import Icon_exit_modal from "./../../images/icon_exit_modal.svg"
import "./signUp_logIn.sass"

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

  handleInput = (events) => {
    this.setState({[events.target.name]: events.target.value})
  }

  componentWillReceiveProps(){
    this.setState({ username: "", email: "", password: "", confirm: "",})
  }

  submit = () => {
    const route = this.props.history.location.pathname.split("/")
    if (route[1] === "login") {
      this.props.logIn(this.state)
    } else {
      if (this.state.password === this.state.confirm) {
        const newUser = {...this.state}
        delete(newUser.confirm)
        this.props.signUp(newUser)
      } else {
        alert("your PASSWORD does NOT match your CONFIRM password")
      }
    }

  }

  render(){
    const route = this.props.history.location.pathname.split("/")

    return (
      <div className="signup-login">

        <div className="signup-login-container">

          <Link to="/">
            <img
              id="icon_exit_modal"
              src={Icon_exit_modal}
              alt="exit modal button"
            />
          </Link>

          <div className="title">

            {this.state[route[1]].title}

          </div>

          <div className="sub-title">

            {this.state[route[1]].subTitle}

          </div>

          <div className="input-container">

            <input
              name="username"
              placeholder="Username"
              spellCheck="false"
              value={this.state.username}
              onChange={this.handleInput}
            />

            {route[1] === "signup" && <>
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

            {route[1] === "login" &&
              <input
                name="password"
                type="password"
                placeholder="Password"
                spellCheck="false"
                value={this.state.password}
                onChange={this.handleInput}
              />
            }

            {route[1] === "signup" &&
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

              {this.state[route[1]].button}

            </button>
            <br />
            <div className="options-container">

              <div className="keep-playing">
                {this.state[route[1]].option1.message}
                <Link to="/">
                  {this.state[route[1]].option1.link}
                </Link>
              </div>

              {this.state[route[1]].option2.message}
              <Link to={"/"+this.state[route[1]].routeTo} >
                {this.state[route[1]].option2.link}
              </Link>

            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default SignUp
