const CONSTANTS = {
  SIGN_IN_ENDPOINT: `${process.env.REACT_APP_COGNITO_HOST}/login?client_id=${process.env.REACT_APP_COGNITO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_COGNITO_REDIRECT_URI}&response_type=token&state=STATE`,
  USER_INFO_ENDPOINT: `${process.env.REACT_APP_COGNITO_HOST}/oauth2/userInfo`,
  WS_HOST: process.env.REACT_APP_WS_HOST,
  USERNAME: 'aiueo',
}

export default CONSTANTS
