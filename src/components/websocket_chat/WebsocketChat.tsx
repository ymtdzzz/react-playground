import React, { ReactElement, useEffect, useState } from 'react'
import axios from 'axios'
import { LoginInfo } from './types'

//import { useLocation } from 'react-router-dom'
import CONSTANTS from './constants'
import queryString from 'query-string'
import './Chat'
import Chat from './Chat'

// expected input is 'id_token=xxx&access_token=xxx&expires_in=3600&token_type=Bearer&state=STATE'
const getToken = (input: string): string | null => {
  let result: { [key: string]: string } = {}
  input.split('&').forEach((item: string) => {
    const keyValue = item.split('=')
    if (keyValue.length === 2) {
      result[keyValue[0]] = keyValue[1]
    }
  })
  if (result['access_token']) {
    return result['access_token']
  } else {
    return null
  }
}

const getLoginInfo = async (token: string): Promise<LoginInfo | null> => {
  return axios
    .get(CONSTANTS.USER_INFO_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return {
        token,
        username: res.data['username'],
        id: res.data['sub'],
      }
    })
    .catch((e) => {
      console.error('Unable to get login info', e)
      return null
    })
}

const WebsocketChat: React.FC = (): ReactElement => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>()

  useEffect(() => {
    const query = queryString.parseUrl(window.location.href, {
      parseFragmentIdentifier: true,
    })
    const token = getToken(query.fragmentIdentifier ?? '')
    getLoginInfo(token ?? '').then((info) => {
      if (info) {
        setLoginInfo(info)
      }
    })
  }, [])

  return (
    <>
      <h2>WebsocketChat</h2>
      {loginInfo ? (
        <Chat loginInfo={loginInfo} />
      ) : (
        <p>
          <a href={CONSTANTS.SIGN_IN_ENDPOINT}>Login</a>
        </p>
      )}
    </>
  )
}

export default WebsocketChat
