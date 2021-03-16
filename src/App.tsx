import React, { ReactElement } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './components/common/Home'
import './App.css'
import Navbar from './components/common/Navbar'
import 'normalize.css'
import DndMatrix from './components/dnd_matrix/DndMatrix'
import WebsocketChat from './components/websocket_chat/WebsocketChat'

const App: React.FC = (): ReactElement => {
  return (
    <div className="App">
      <Router>
        <div>
          <Navbar />
          <hr />
          <Route exact path="/" component={Home} />
          <Route exact path="/DndMatrix" component={DndMatrix} />
          <Route exact path="/WebsocketChat" component={WebsocketChat} />
        </div>
      </Router>
    </div>
  )
}

export default App
