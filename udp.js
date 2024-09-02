const dgram = require('dgram')
const socket = dgram.createSocket('udp4')
socket.on('message', (message,rinfo)=>{
    console.log(message.toString(),rinfo)
})
socket.bind(8081)