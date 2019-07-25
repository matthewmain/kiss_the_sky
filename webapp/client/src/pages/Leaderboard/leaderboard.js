import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Row, Col, Container } from 'react-bootstrap'
import moment from "moment"
import Winner from "./../../api/winner.js"
import "./leaderboard.sass"

import Flower from "./../../components/Flower/flower.js"
import Paginate_arrow from './../../images/paginate_arrow.svg'

class Leaderboard extends Component {

  state = {
    opacity: 0
  }

  componentDidMount(){
    this.props.appState.set({showGame: false})
    window.requestAnimationFrame(()=>{ this.setState({opacity: 1}) })
    window.pause()
    const route = this.props.history.location.pathname.split("/")
    if (!route[2]) route[2] = "expert"
    Winner.leaderboard(
      this.props.appState,
      route[2],
      this.props.appState.leaderboardRef.page
    )
  }

  toggledDifficulty = (difficulty)=>{
    const page = 1
    Winner.leaderboard(this.props.appState, difficulty, page)
  }

  componentWillUnmount(){
    this.props.appState.set({showGame: true})
  }

  paginate(way){
    Winner.leaderboard(
      this.props.appState,
      this.props.appState.leaderboardRef.difficulty,
      this.props.appState.leaderboardRef.page + (way === "left" ? -1 : 1)
    )
  }

  render(){
    const route = this.props.history.location.pathname.split("/")
    if (!route[2]) route[2] = "expert"
    const length = this.props.appState.leaderboard.length
    const page = this.props.appState.leaderboardRef.page
    return (
      <div className="leaderboard" style={{ opacity: `${this.state.opacity}`}}>


        <div className="leaderboard-header">
          Leaderboard
          <div className="leaderboard-subtitle">
            All-Time High Scores
          </div>
        </div>

        <Container>
          <Row className="leaderboard-levels">

            <Col md={4} className={"container "+(route[2] === "beginner" ? "active" : "")}>
              <Link to="/leaderboard/beginner" className='link'
                onClick={()=>this.toggledDifficulty("beginner")}>
                <div className="level beg">
                  <div className="title">

                    Beginner

                  </div>
                  <div className="subtitle"> Red Flower Garden </div>
                </div>
              </Link>
            </Col>

            <Col md={4} className={"container "+(route[2] === "intermediate" ? "active" : "")}>
              <Link to="/leaderboard/intermediate" className='link'
                onClick={()=>this.toggledDifficulty("intermediate")}>
                <div className="level int">
                  <div className="title">

                    Intermediate

                  </div>
                  <div className="subtitle"> Colorful Garden </div>
                </div>
              </Link>
            </Col>

            <Col md={4} className={"container "+(route[2] === "expert" ? "active" : "")}>
              <Link to="/leaderboard/expert" className='link'
                onClick={()=>this.toggledDifficulty("expert")}>
                <div className="level exp">
                  <div className="title">

                    Expert

                  </div>
                  <div className="subtitle"> Tiny White Flower </div>
                </div>
              </Link>
            </Col>

          </Row>
        </Container>

        <Container className="leaderboard-ranks">

          {this.props.appState.leaderboard.length > 0 &&
            this.props.appState.leaderboard.map((score,index)=>{

            let rank = index+((this.props.appState.leaderboardRef.page - 1) * 10)+1
            rank = rank.toString().replace(/0/g,"O")
            const username = score.username.toString().replace(/0/g,"O")
            const date = moment(score.date, 'YYYY-MM-DD').format('M/D/YY').replace(/0/g,"O")
            const years = score.years.replace(/0/g,"O")

            return (<Row className="details-container" key={index}>

              <Col md={8} className="left-col">

                <div className="rank">
                  {rank}.
                </div>

                <div className="flower-avatar-container">
                  <Flower
                    size={20}
                    colors={score.avatar.colors}
                    appState={this.props.appState}
                  ></Flower>
                </div>

                <div className="username">
                  &nbsp; {username}
                </div>

                <div className="date">
                  {date}
                </div>


              </Col>

              <Col md={4} className="right-col">
                <div>
                  {years} years
                </div>
              </Col>

            </Row>

          )})}

          <button
            className={"paginate "+(page > 1 ? "" : "disable")}
            onClick={()=>this.paginate("left")}>

            <img className="arrow left" src={Paginate_arrow} alt="icon menu"/>

          </button>

          <button
            className={"paginate "+(length > 9 ? "" : "disable")}
            onClick={()=>this.paginate("right")}>

            <img className="arrow right" src={Paginate_arrow} alt="icon menu"/>

          </button>

        </Container>

      </div>
    )
  }
}

export default Leaderboard
