import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = (): ReactElement => {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/About">About</Link>
    </div>
  )
}

export default Navbar
