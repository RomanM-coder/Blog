import { createContext } from 'react'
import { io } from 'socket.io-client'
import { basicUrl } from '../utilita/default'

export const socket = io(basicUrl.urlSocket, {
  transports: ['websocket'],
  path: '/socket.io', // Должен совпадать с location в Nginx
})

export const SocketContext = createContext(socket)
