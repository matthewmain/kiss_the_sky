import React, { Component } from 'react'
import moment from "moment"
import "./myHighScores.sass"

import Winner from "./../../api/winner.js"

class MyHighScores extends Component {

  state = {
    scoresPage: 1,
    viewMyScores: false
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

        My High Scores <br/><br/>

        {this.props.appState.myHighScores.length > 0 && <>
          {!this.state.viewMyScores && <>

            <div style={{display: "inline-block", width: 205, backgroundColor: '#333', margin: 5, padding: 5}}>
              Beginner
              <hr/>
              {beginnerBest && <>
                <div> #{beginnerBest.rank}. </div>
                <div> {beginnerBest.years} </div>
                <div> {moment(beginnerBest.date, 'YYYY-MM-DD').format('M/D/YY')} </div>
              </>}
              {!beginnerBest && <>
                <br/>
                Not Yet. <br/>
                Keep Trying!<br/>
              </>}
            </div>

            <div style={{display: "inline-block", width: 205, backgroundColor: '#333', margin: 5, padding: 5}}>
              Intermediate
              <hr/>
              {intermediateBest && <>
                <div> #{intermediateBest.rank}. </div>
                <div> {intermediateBest.years} </div>
                <div> {moment(intermediateBest.date, 'YYYY-MM-DD').format('M/D/YY')} </div>
              </>}
              {!intermediateBest && <>
                <br/>
                Not Yet. <br/>
                Keep Trying!<br/>
              </>}
            </div>

            <div style={{display: "inline-block", width: 205, backgroundColor: '#333', margin: 5, padding: 5}}>
              expert
              <hr/>
              {expertBest && <>
                <div> #{expertBest.rank}. </div>
                <div> {expertBest.years} </div>
                <div> {moment(expertBest.date, 'YYYY-MM-DD').format('M/D/YY')} </div>
              </>}
              {!expertBest && <>
                <br/>
                Not Yet. <br/>
                Keep Trying!<br/>
              </>}
            </div>

          </>}

          <br/>
          <button onClick={()=>this.setState({viewMyScores: !this.state.viewMyScores})}>

            {!this.state.viewMyScores && <>
              view all-time high scores
            </>}

            {this.state.viewMyScores && <>
              top scores
            </>}

          </button>

          {this.state.viewMyScores && <>

            {allTimePage.map((score,index)=>
              <div className="scores-container" key={index}>

                  <div style={{width: 400, display: "inline-block", paddingLeft: 50}}>
                    #{score.rank}.
                    &nbsp;
                    {score.difficulty}
                  </div>

                  {moment(score.date, 'YYYY-MM-DD').format('M/D/YY')}

                  <div style={{float: "right"}}>
                    {score.years} years
                  </div>

              </div>)
            }

            {this.state.scoresPage > 1 &&
              <button onClick={()=>this.setState({scoresPage: this.state.scoresPage-1})}>
                &#x2190;
              </button>
            }

            {(this.state.scoresPage*10) < myHighScores.length &&
              <button onClick={()=>this.setState({scoresPage: this.state.scoresPage+1})}>
                &#x2192;
              </button>
            }

          </>}
        </>}

        {this.props.appState.myHighScores.length <= 0 &&
          <div>
            <br/>
            Not Yet. <br/>
            Keep Trying!
          </div>
        }

      </div>
    )
  }
}

export default MyHighScores
