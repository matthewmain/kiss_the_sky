import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Row, Col, Container } from 'react-bootstrap'
import moment from "moment"
import "./dashboard.sass"

import Flower from "./../../components/Flower/flower.js"

import SavedSessions from "./../../components/SavedSessions/savedSessions.js"
import MyHighScores from "./../../components/MyHighScores/myHighScores.js"
import Settings from "./../../components/Settings/settings.js"

class Dashboard extends Component {

  state = {
    opacity: 0,
    history: this.props.history,
    route: "",
  }

  componentDidMount(){
    this.props.appState.set({showGame: false})
    window.requestAnimationFrame(()=>{ this.setState({opacity: 1}) })
    window.pause()
  }

  componentWillUnmount(){
    this.props.appState.set({showGame: true})
  }

  componentDidUpdate(){
    if (!this.props.appState.username && !this.props.appState.waitingforSession) {
      // 📝 If no user is logged in. Route to home page...
      this.state.history.push('/')
    }
  }

  render(){
    const route = this.props.history.location.pathname.split("/")
    if (!route[2]) route[2] = "savedsessions"

    const memberSince = moment(this.props.appState.created_at, 'YYYY-MM-DD').format('MMM, Do YYYY').replace(/0/g,"O")

    return (
      <div className="dashboard" style={{ opacity: `${this.state.opacity}`}}>

        <div className="title">

          <div className="flower-avatar-container">
            <Flower
              hide={!this.props.appState.username}
              colors={this.props.appState.avatar.colors}
              size={60}
              appState={this.props.appState}
            ></Flower>
          </div>

          <div className="user">
            <div className="username">
              {this.props.appState.username}
            </div>
            <div className="member">
              {this.props.appState.created_at && <>
                Member since {memberSince}
              </>}
            </div>
          </div>

        </div>


        <Container>
          <Row className="dashboard-levels">

            <Col md={4} className="container">
              <Link to="/dashboard/savedsessions" className="link">
                <div className={"title "+(route[2] === "savedsessions" ? "active" : "")}>

                  Saved Sessions

                </div>
              </Link>
            </Col>

            <Col md={4} className="container">
              <Link to="/dashboard/myhighscores" className='link'>
                <div className={"title "+(route[2] === "myhighscores" ? "active" : "")}>

                  My High Scores

                </div>
              </Link>
            </Col>

            <Col md={4} className="container">
              <Link to="/dashboard/settings" className='link'>
                <div className={"title "+(route[2] === "settings" ? "active" : "")}>

                  Settings

                </div>
              </Link>
            </Col>

          </Row>
        </Container>

        <Container className="dashboard-container">

          {(!route[2] || route[2] === "savedsessions") && <>

            <SavedSessions
              appState={this.props.appState}
              history={this.state.history}
            />

          </>}

          {route[2] === "myhighscores" && <>

            <MyHighScores
              appState={this.props.appState}
              viewMyScores={this.state.viewMyScores}
            />

          </>}

          {route[2] === "settings" && <>

            <Settings
              appState={this.props.appState}
            />

          </>}

        </Container>

      </div>
    )
  }
}

export default Dashboard
