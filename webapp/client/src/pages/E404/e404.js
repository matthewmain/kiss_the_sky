import React from 'react'
import { Link } from "react-router-dom"
import "./e404.sass"

function E404() {

  return (
    <div className="e404">
      <div className="e404-title">
        404 Unknown Page
      </div>
      <Link to="/" className="kts-link">
        /home
      </Link>
    </div>
  )

}

export default E404
