import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "./logIn.sass"

class LogIn extends Component {

  constructor(props){
    super(props)
    this.state = {
      username: "",
      password: "",
      history: this.props.history
    }
  }

  handleInput = (events) => {
    this.setState({[events.target.name]: events.target.value})
  }

  submit = () => {
    this.props.logIn(this.state)
  }

  render(){
    return (
      <div className="login">

        {"🔹"} Login

        <Link to="/" style={{textDecoration: "none", paddingLeft: 50}}>
          {"❌"}
        </Link>

        <br /><br />

        Username: <br />
        <input
          name="username"
          value={this.state.username}
          onChange={this.handleInput}
        /><br /><br />

        Password: <br />
        <input
          name="password"
          type="password"
          value={this.state.password}
          onChange={this.handleInput}
        /><br />

        <br />
        <button
          className="btn"
          onClick={this.submit}
        >
          Log In
        </button>

        <hr />
        <Link to="/signup" >
          sign up
        </Link>

      </div>
    )
  }
}

export default LogIn
