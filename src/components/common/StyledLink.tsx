import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import 'styled-components'
import styled from 'styled-components'

const LinkWrapper = styled.a`
  margin-left: 3rem;
`

type Props = {
  to: string,
  text: string,
}

const StyledLink: React.FC<Props> = ({to, text}): ReactElement => {
  return (
    <LinkWrapper>
      <Link to={to}>{text}</Link>
    </LinkWrapper>
  )
}

export default StyledLink
