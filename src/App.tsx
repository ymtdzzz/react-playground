import React, { ReactElement } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './components/common/Home'
import About from './components/common/About'
import './App.css'
import Navbar from './components/common/Navbar'

const App: React.FC = (): ReactElement => {
  return (
    <div className="App">
      <Router>
        <div>
          <Navbar />
          <hr />
          <Route exact path="/" component={Home} />
          <Route exact path="/About" component={About} />
        </div>
      </Router>
    </div>
  )
}

export default App
