import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "./signUp.sass"

class SignUp extends Component {

  constructor(props){
    super(props)
    this.state = {
      username: "",
      email: "",
      password: "",
      confirm: "",
      history: this.props.history
    }
  }

  handleInput = (events) => {
    this.setState({[events.target.name]: events.target.value})
  }

  submit = () => {
    if (this.state.password === this.state.confirm) {
      const newUser = {...this.state}
      delete(newUser.confirm)
      this.props.signUp(newUser)
    } else {
      alert("your PASSWORD does NOT match your CONFIRM password")
    }
  }

  render(){
    return (
      <div className="signup">

        {"🔺"} Sign Up

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

        <hr />
        <Link to="/login" >
          login
        </Link>

      </div>
    )
  }
}


export default SignUp
