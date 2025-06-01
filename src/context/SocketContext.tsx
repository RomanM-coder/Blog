import {createContext} from 'react'
import {io} from 'socket.io-client'
import { basicUrl } from '../utilita/defauit'

export const socket = io(basicUrl.urlBack,{
  transports: ['websocket'],
})

export const SocketContext = createContext(socket)