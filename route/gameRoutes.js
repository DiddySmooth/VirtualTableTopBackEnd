const express = require('express')

const gameRouter = express.Router()

const gameController = require("../controllers/gameController")

gameRouter.post('/create', gameController.create)
gameRouter.post('/login', gameController.login)
gameRouter.get('/getinfo', gameController.getInfo)
gameRouter.get('/authcheck', gameController.authCheck)
gameRouter.post('/userlogin', gameController.findOrCreateRecord)
gameRouter.get('/gameusers', gameController.findAllUsers)
module.exports = gameRouter