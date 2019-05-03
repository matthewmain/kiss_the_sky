import React, { Component } from 'react'
import { Link } from "react-router-dom"
import Icon_exit_modal from "./../../images/icon_exit_modal.svg"
import "./signUp_logIn.sass"

class SignUp extends Component {

  constructor(props){ // super(props) needed to change our `history` (see this.state.history note)
    super(props)
    this.state = {
      username: "",
      email: "",
      newpassword: "",
      password: "",
      confirm: "",
      opacity: 0,
      history: this.props.history, // This will allow us to target the LAST page user was on...
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
  }

  componentDidMount(){
    this.togglePauseResume()
    window.requestAnimationFrame(()=>{ this.setState({opacity: 1}) })
  }

  componentDidUpdate(){
    if (this.props.appState.transition === "close" && this.props.appState.username) {
      this.props.appState.changeAppState("transition", "open")
      this.exit()
    }
  }

  componentWillReceiveProps(){
    this.setState({ username: "", email: "", password: "", confirm: "",})
  }

  componentWillUnmount(){ this.togglePauseResume() }

  togglePauseResume(){
    if (window.gameHasBegun) {
      const togglePause = document.querySelector(".icon_game_run")
      togglePause.click()
    }
  }

  handleInput = (events) => {
    this.setState({[events.target.name]: events.target.value})
  }

  exit = ()=>{
    this.setState({opacity: 0})
    let back = this.state.history.location.pathname
    if(back === "/login" || back ==="/signup") back = "/"
    setTimeout(()=>{this.props.history.push(back)},490)  // 🚨 Check delay on .signup-login CLASS in css
  }

  submit = ()=>{
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
    // const route = ["","login"]

    return (
      <div className="signup-login" style={{ opacity: `${this.state.opacity}`}}>

        <div className="signup-login-container">

          <img
            id="icon_exit_modal"
            src={Icon_exit_modal}
            alt="exit modal button"
            onClick={this.exit}
          />

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
