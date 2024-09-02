const net =require('net');

const server =net.createServer((socket) => {
    socket.write("hello world!");
    socket.on('data', (data) =>{
        console.log(data.toString());
    })
})
server.listen (4000)