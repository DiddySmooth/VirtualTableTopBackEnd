const express = require('express')
const app = express()
require('dotenv').config()

app.use(require('morgan')('tiny'))
const routesReport = require('rowdy-logger').begin(app)

app.use(express.json())
app.use(require('cors')())

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
  routesReport.print()
})

const userRouter = require('./route/userRoutes')
const gameRouter = require('./route/gameRoutes')
app.use('/user', userRouter)
app.use('/game', gameRouter)