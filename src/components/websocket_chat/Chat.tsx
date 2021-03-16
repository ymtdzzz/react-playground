import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import 'react-chat-elements/dist/main.css'
import { LoginInfo } from './types'
import CONSTANTS from './constants'
import { MessageBox } from 'react-chat-elements'

const ChatContainer = styled.div`
  box-sizing: border-box;
  border-radius: 0.7rem;
  border: 1px solid black;
  max-width: 50%;
  height: 500px;
  margin: 0.5rem auto;
  overflow: hidden;
`

const ChatHeader = styled.div`
  border-bottom: 1px solid #ccc;
  max-height: 50px;
`

const ChatMessage = styled.div`
  height: 390px;
`

const ChatFooter = styled.div`
  padding: 3px;
  max-height: 50px;
`

const ErrorMsg = styled.p`
  color: red;
`

const Loading = styled.div`
  min-height: 100%;
  background-color: white;
  opcity: 0.7;
`

interface Message {
  message: string
  fromSub: string
  toSub: string
  timestamp: Date
}

type Props = {
  loginInfo: LoginInfo
}

const Chat: React.FC<Props> = (props: Props): ReactElement => {
  const [partnerId, setPartnerId] = useState<string>('')
  const [partnerName, setPartnerName] = useState<string>('')
  const [partnerIsOnline, setPartnerIsOnline] = useState<boolean>(false)
  const [connection, setConnection] = useState<WebSocket>()
  const [errorMsg, setErrorMsg] = useState('')
  const [connectionComplete, setConnectionComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messagesState, setMessagesState] = useState<Message[]>([])

  const initializeConnection = (c: WebSocket) => {
    c.onopen = WSOnOpen
    c.onclose = WSOnClose
    c.onerror = WSOnError
    c.onmessage = WSOnMessage
    setConnection(c)
  }

  const onSendMsg = () => {
    console.log(message)
    if (connection) {
      const data = {
        action: 'SENDMSG',
        message,
        timestamp: new Date().getTime(),
        fromSub: props.loginInfo.id,
        toSub: partnerId,
      }
      connection.send(JSON.stringify(data))
      const msg: Message = {
        message: data.message,
        fromSub: data.fromSub,
        toSub: data.toSub,
        timestamp: new Date(data.timestamp),
      }
      addMsg(msg)
    }
  }

  const onSubmitPartnerId = () => {
    setIsLoading(true)
    console.log(partnerId)
    try {
      const conn = new WebSocket(
        `${CONSTANTS.WS_HOST}?connectionType=chat&sub=${partnerId}&selfSub=${props.loginInfo.id}&Authorizer=${props.loginInfo.token}`
      )
      initializeConnection(conn)
      console.log('Connection established successfully!')
    } catch (e) {
      setErrorMsg('Fail to initialize websocket connection')
      console.error('Fail to initialize websocket connection', e)
    }
  }

  const onBroadcast = () => {
    if (connection) {
      const data = {
        action: 'GREETING',
        message: 'Hello everyone!!',
      }
      connection.send(JSON.stringify(data))
      console.log('broadcast message sended')
    }
  }

  const onPartnerIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPartnerId(event.target.value)
  }

  const onMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  // Websocket event handler
  const WSOnOpen = (_event: Event) => {
    console.log('onOpen')
    setConnectionComplete(true)
  }

  const WSOnClose = (_event: CloseEvent) => {
    console.log('onClose')
  }

  const WSOnError = (event: Event) => {
    console.log('onError')
    console.log(event)
  }

  const WSOnMessage = (event: MessageEvent<any>) => {
    console.log('onMessage')
    // handle incoming message
    const data = JSON.parse(event.data)
    console.log(JSON.stringify(data))
    switch (data['action']) {
      case 'ISONLINE':
        if (data['value'] === '1') {
          setPartnerIsOnline(true)
        } else {
          setPartnerIsOnline(false)
        }
        break
      case 'PARTNERINFO':
        console.log('partnerinfo')
        setPartnerName(data['value'])
        setIsLoading(false)
        break
      case 'SENDMSG':
        console.log('received message')
        console.log(`timestamp: ${data['timestamp']}`)
        const msg: Message = {
          message: data['message'],
          fromSub: data['fromSub'],
          toSub: data['toSub'],
          timestamp: new Date(data['timestamp']),
        }
        addMsg(msg)
        break
      case 'GETMSG':
        console.log('received logs')
        const msgs: Message[] = data['messages'].map((item: Message) => {
          return {
            message: item.message,
            toSub: item.toSub,
            fromSub: item.fromSub,
            timestamp: item.timestamp,
          }
        })
        setMessagesState(msgs)
        break
    }
  }

  const addMsg = (newMsg: Message) => {
    setMessagesState((arr) => [...arr, newMsg])
  }

  const renderPartnerInfo = (): ReactElement => {
    if (partnerIsOnline) {
      return <p>{partnerName} [ONLINE]</p>
    } else {
      return <p>{partnerName} [OFFLINE]</p>
    }
  }

  const renderMessages = (msgs: Message[]): ReactElement[] => {
    let i = 0
    const mboxes = msgs.map((msg) => {
      i += 1
      return (
        <MessageBox
          key={i}
          position={msg.fromSub === props.loginInfo.id ? 'right' : 'left'}
          type={'text'}
          text={msg.message}
          title={''}
          data={{}}
          date={msg.timestamp}
        />
      )
    })
    return mboxes
  }

  useEffect(() => {
    if (connection && connectionComplete) {
      const data = {
        action: 'STATUS',
        partnerSub: partnerId,
      }
      connection.send(JSON.stringify(data))
      console.log('partner user info request sended')
      const logsData = {
        action: 'GETMSG',
        fromSub: props.loginInfo.id,
        toSub: partnerId,
      }
      connection.send(JSON.stringify(logsData))
      console.log('logs get request sended')
    }
  }, [connection, connectionComplete, partnerId, props.loginInfo.id])

  return (
    <>
      <p>hello, {props.loginInfo.username} !</p>
      <p>your id: {props.loginInfo.id}</p>
      <span>partner id:</span>
      <input type="text" value={partnerId} onChange={onPartnerIdChange} />
      <button onClick={onSubmitPartnerId}>START</button>
      <button onClick={onBroadcast}>Broadcast</button>
      <ChatContainer>
        {isLoading ? (
          <Loading>Connecting...</Loading>
        ) : (
          <>
            <ChatHeader>{partnerName !== '' && renderPartnerInfo()}</ChatHeader>
            <ErrorMsg>{errorMsg}</ErrorMsg>
            <ChatMessage>{renderMessages(messagesState)}</ChatMessage>
            <ChatFooter>
              {partnerName !== '' && (
               <>
                 <input type="text" value={message} onChange={onMessageChange} />
                 <button onClick={onSendMsg}>Send</button>
               </>
              )}
            </ChatFooter>
          </>
        )}
      </ChatContainer>
    </>
  )
}

export default Chat
