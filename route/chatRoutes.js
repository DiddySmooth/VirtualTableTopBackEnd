const express = require('express')

const chatRouter = express.Router()

const chatController = require("../controllers/chatController")

chatRouter.post('/create', chatController.create)
chatRouter.get('/getall', chatController.getall)

module.exports = chatRouter