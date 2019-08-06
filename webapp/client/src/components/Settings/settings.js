import React from 'react'
import "./settings.sass"
import User from "./../../api/user.js"

import Flower from "./../../components/Flower/flower.js"
import Flower_Options from "./../../styles/flower_options.json"

const Settings = (props) => {

  function selectNew(colors) {
    User.changeAvatar(colors, props.appState)
  }

  return (
    <div className="settings">

      Select alternate flower avatar. <br/><br/>

      {Flower_Options.map((colors,index)=>
        <div className="flower-options" key={index}
          onClick={()=>{selectNew(colors)}}>

          <div className="flower-avatar-container">
            <Flower
              colors={colors}
              size={50}
              appState={props.appState}
            ></Flower>
          </div>

        </div>)
      }

      <div className="message">
        For questions and support,<br/>
        email us at <br/>
        <a href="support@kissthesky.game">
          support@kissthesky.app
        </a>
      </div>

    </div>
  )

}

export default Settings
