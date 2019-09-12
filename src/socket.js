import socket from 'socket.io-client'

const io = socket('http://localhost:8080')

export default io
