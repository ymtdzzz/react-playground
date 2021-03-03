import React, { ReactElement } from 'react'
import StyledLink from './StyledLink'

const Navbar: React.FC = (): ReactElement => {
  return (
    <div>
      <StyledLink to="/" text="Home" />
      <StyledLink to="/DndMatrix" text="DndMatrix" />
    </div>
  )
}

export default Navbar
