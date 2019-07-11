import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Row, Col, Container } from 'react-bootstrap'
import moment from "moment"
import Paginate_arrow from './../../images/paginate_arrow.svg'
import "./leaderboard.sass"

import Winner from "./../../api/winner.js"

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

                <svg
                  id="flower_avatar"
                  alt="flower avatar"
                  className="flower-avatar"
                  width="43px" height="49px" viewBox="0 0 43 49" version="1.1" xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="page-header-right" transform="translate(-41.000000, -1.000000)" fillRule="nonzero">
                      <g id="header-right">
                        <g id="header-right-(logged-in,-closed)">
                          <g id="avatar" transform="translate(37.000000, 0.000000)">
                            <g id="flower-avatar" transform="translate(4.000000, 1.000000)">
                              <polygon id="hex"
                                fill={score.avatar ? score.avatar.colors.pistil : "#E0993E"} points="25.1 17.2 29.2 24.0996728 25.2 31 17.1 31.1 13 24.0996728 17 17.3044867"></polygon>
                              <path id="petals"
                                fill={score.avatar ? score.avatar.colors.petal : "#0E7FD9"} d="M17.1278935,17.3044867 C13.7293999,10.6254606 15.0510363,4.85729839 21.0928027,0 C27.134569,4.85729839 28.4562054,10.6254606 25.0577118,17.3044867 L17.1278935,17.3044867 Z M25.0577118,17.3044867 C29.2041618,11.052751 34.9134596,9.30120091 42.1856053,12.0498364 C40.955226,19.6557703 36.5675645,23.6723824 29.022621,24.0996728 L25.0577118,17.3044867 Z M29.022621,24.0996728 C36.5675645,24.5269632 40.955226,28.5435753 42.1856053,36.1495092 C34.9134596,38.8981447 29.2041618,37.1465946 25.0577118,30.8948589 L29.022621,24.0996728 Z M25.0577118,30.8948589 C28.4562054,37.573885 27.134569,43.3420472 21.0928027,48.1993456 C15.0510363,43.3420472 13.7293999,37.573885 17.1278935,30.8948589 L25.0577118,30.8948589 Z M17.1278935,30.8948589 C12.9814436,37.1465946 7.27214573,38.8981447 2.84217094e-14,36.1495092 C1.23037938,28.5435753 5.61804082,24.5269632 13.1629843,24.0996728 L17.1278935,30.8948589 Z M13.1629843,24.0996728 C5.61804082,23.6723824 1.23037938,19.6557703 1.10134124e-13,12.0498364 C7.27214573,9.30120091 12.9814436,11.052751 17.1278935,17.3044867 L13.1629843,24.0996728 Z"></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>

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
