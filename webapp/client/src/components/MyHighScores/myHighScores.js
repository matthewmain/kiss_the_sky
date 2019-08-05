import React, { Component } from 'react'
import moment from "moment"
import "./myHighScores.sass"

import Winner from "./../../api/winner.js"

import Paginate_arrow from './../../images/paginate_arrow.svg'

class MyHighScores extends Component {

  state = {
    scoresPage: 1,
  }

  componentDidMount(){
    Winner.myHighScores(this.props.appState)
  }

  render(){

    const myHighScores = this.props.appState.myHighScores
    let beginnerBest, intermediateBest, expertBest, allTimePage;
    if (myHighScores) {
      const beginners = myHighScores.filter(g=>g.difficulty === "beginner")
      beginnerBest = beginners.sort((a,b) => a.years - b.years)[0]
      const intermediates = myHighScores.filter(g=>g.difficulty === "intermediate")
      intermediateBest = intermediates.sort((a,b) => a.years - b.years)[0]
      const experts = myHighScores.filter(g=>g.difficulty === "expert")
      expertBest = experts.sort((a,b) => a.years - b.years)[0]
      allTimePage = myHighScores.sort((a,b) => a.years - b.years)
        .slice(
          (this.state.scoresPage-1)*10,
          this.state.scoresPage*10
        )
    }

    return (
      <div className="myHighScores">

        <div className="best">Best Scores</div>

        <div className="score-card beginner">

            <div className="title"> Beginner </div>
            <div className="sub-title"> Red Flower Garden </div>
          {beginnerBest && <>
            <div className="rank"> #{beginnerBest.rank.toString().replace(/0/g,"O")} </div>
            You kissed the sky in
            <div className="years"> {beginnerBest.years.replace(/0/g,"O")} </div>
            years
            <div className="date">
              on {moment(beginnerBest.date, 'YYYY-MM-DD').format('M/D/YY').replace(/0/g,"O")}
            </div>
          </>}

          {!beginnerBest && <>
            <div className="none-yet" > None yet. </div>
            <div className="keep-trying"> Keep trying! </div>
          </>}

          <a href="/leaderboard/beginner" class="leaderboard-links"> Beginner Leaderboard > </a>

        </div>



        <div className="score-card intermediate">

            <div className="title"> Intermediate </div>
            <div className="sub-title"> Colorful Flower Garden </div>
          {intermediateBest && <>
            <div className="rank"> #{intermediateBest.rank.toString().replace(/0/g,"O")} </div>
            You kissed the sky in
            <div className="years"> {intermediateBest.years.replace(/0/g,"O")} </div>
            years
            <div className="date">
              on {moment(intermediateBest.date, 'YYYY-MM-DD').format('M/D/YY').replace(/0/g,"O")}
            </div>
          </>}

          {!intermediateBest && <>
            <div className="none-yet" > None yet. </div>
            <div className="keep-trying"> Keep trying! </div>
          </>}

          <a href="/leaderboard/intermediate" class="leaderboard-links"> Intermediate Leaderboard > </a>

        </div>

        <div className="score-card expert">

            <div className="title"> Expert </div>
            <div className="sub-title"> Tiny White Flower </div>
          {expertBest && <>
            <div className="rank"> #{expertBest.rank.toString().replace(/0/g,"O")} </div>
            You kissed the sky in
            <div className="years"> {expertBest.years.replace(/0/g,"O")} </div>
            years
            <div className="date">
              on {moment(expertBest.date, 'YYYY-MM-DD').format('M/D/YY').replace(/0/g,"O")}
            </div>
          </>}

          {!expertBest && <>
            <div className="none-yet" > None yet. </div>
            <div className="keep-trying"> Keep trying! </div>
          </>}

          <a href="/leaderboard/expert" class="leaderboard-links"> Expert Leaderboard > </a>

        </div>

        {this.props.appState.myHighScores.length > 0 && <>

          <div className="all">All Scores</div>

          <div className="scores-container">
            {allTimePage.map((score,index)=>
              <div className="score-container" key={index}>

                  <div className="rank">
                    #{score.rank.toString().replace(/0/g,"O")}
                    &nbsp; &nbsp;
                    {score.difficulty}
                  </div>

                  {moment(score.date, 'YYYY-MM-DD').format('M/D/YY').replace(/0/g,"O")}

                  <div style={{float: "right"}}>
                    {score.years.replace(/0/g,"O")} years
                  </div>

              </div>)
            }
          </div>

          <button
            className={"paginate "+(this.state.scoresPage > 1 ? "" : "disable")}
            onClick={()=>this.setState({scoresPage: this.state.scoresPage-1})}>

            <img className="arrow left" src={Paginate_arrow} alt="icon menu"/>

          </button>

          <button
            className={"paginate "+((this.state.scoresPage*10) < myHighScores.length ? "" : "disable")}
            onClick={()=>this.setState({scoresPage: this.state.scoresPage+1})}>

            <img className="arrow right" src={Paginate_arrow} alt="icon menu"/>

          </button>

        </>}

      </div>
    )
  }
}

export default MyHighScores
