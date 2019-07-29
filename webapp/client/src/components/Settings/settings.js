import React from 'react'
import "./settings.sass"
import User from "./../../api/user.js"

import Flower from "./../../components/Flower/flower.js"

const Settings = (props) => {

  const colors = [
    { pistil: "#E0993E", petal: "#C90606" },
    { pistil: "#E0993E", petal: "#E8B741" },
    { pistil: "#E0993E", petal: "#E76335" },
    { pistil: "#E0993E", petal: "#889ACD" },
    { pistil: "#E0993E", petal: "#30C1B3" },
    { pistil: "#E0993E", petal: "#A330C1" },
    { pistil: "#E0993E", petal: "#F5E8A8" },
    { pistil: "#E0993E", petal: "#FFFFFF" },
    { pistil: "#E0993E", petal: "#FF0DCB" },
    { pistil: "#E0993E", petal: "#0E7FD9" }
  ]

  function selectNew(colors) {
    User.changeAvatar(colors, props.appState)
  }

  return (
    <div className="settings">

      Select alternate flower avatar. <br/><br/>

      {colors.map((colors,index)=>
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
