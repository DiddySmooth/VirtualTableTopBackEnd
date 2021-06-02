const express = require('express')
const app = express()
const http = require('http')
const socket = require('socket.io')

require('dotenv').config()
app.use(require('morgan')('tiny'))
const routesReport = require('rowdy-logger').begin(app)

const server = http.createServer(app, {
    cors:{
      origin: "*",
      credentials: true,
      methods: ["GET", "POST"]
    }
  })
const io = socket(server)

app.use(express.json())
app.use(require('cors')())



const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    routesReport.print()
})

const userRouter = require('./route/userRoutes')
const gameRouter = require('./route/gameRoutes')
const chatRouter = require('./route/chatRoutes')
const tokenRouter = require('./route/tokenRoutes')

app.use('/user', userRouter)
app.use('/game', gameRouter)
app.use('/chat', chatRouter)
app.use('/token', tokenRouter)

io.on('connection', function (socket) {
   let roomId;
    socket.on('Message', function (game) {
        io.sockets.in(roomId).emit("refreshChat")
    })

    socket.on("room", function (roomNumber) {
        roomId = roomNumber
        socket.join(roomId)
        io.sockets.in(roomId).emit("refreshUserBar")
    })

    socket.on("disconnect", function () {
        console.log("disconnect")
    })

});