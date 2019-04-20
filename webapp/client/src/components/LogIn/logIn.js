import React, { Component } from 'react'
import "./logIn.sass"

class LogIn extends Component {

  state = {
    username: "Jordan",
    password: "123456"
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
        Username: <br />
        <input
          name="username"
          value={this.state.username}
          placeholder="...or email"
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
      </div>
    )
  }
}

export default LogIn
