import React from 'react'
import ReactDOM from 'react-dom'
import './styles/style.css'
import './styles/index.sass'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
// The Service Worker only in the developement enviroment.
