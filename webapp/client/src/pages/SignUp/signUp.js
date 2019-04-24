import React, { Component } from 'react'
import "./signUp.sass"

class SignUp extends Component {

  state = {
    username: "",
    email: "",
    password: "",
    confirm: ""
  }

  handleInput = (events) => {
    this.setState({[events.target.name]: events.target.value})
  }

  submit = () => {
    if (this.state.password === this.state.confirm) {
      const obj = {...this.state}
      delete(obj.confirm)
      this.props.signUp(obj)
    } else {
      alert("your PASSWORD does NOT match your CONFIRM password")
    }
  }

  render(){
    return (
      <div className="signup">

        Username: <br />
        <input
          name="username"
          value={this.state.username}
          onChange={this.handleInput}
        /><br /><br />

        Email: <br />
        <input
          name="email"
          value={this.state.email}
          onChange={this.handleInput}
        /><br /><br />

        Password: <br />
        <input
          name="password"
          type="password"
          value={this.state.password}
          onChange={this.handleInput}
        /><br /><br />

        Confirm: <br />
        <input
          name="confirm"
          type="password"
          value={this.state.confirm}
          onChange={this.handleInput}
        /><br /><br />

        <button
          className="btn"
          onClick={this.submit}
        >
          Sign Up
        </button>

      </div>
    )
  }
}


export default SignUp
