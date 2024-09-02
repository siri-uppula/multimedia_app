const express = require('express')
const app = express()
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}))

const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render("home");
})
app.get('/new-room',(req,res)=>{
    res.redirect("/"+uuidV4())
})
app.get('/close-room',(req,res)=>{
    res.redirect("/")
})
app.post("/e-room",(req,res)=>{
    res.redirect("/"+req.body.room)
})
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('new-user-connection', userId);


    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    })
  })
})
const PORT = process.env.PORT || 3030
server.listen(PORT, (req, res)=>{
  console.log("started listening on port ",PORT)
})