const express = require('express')

const tokenRouter = express.Router()

const tokenController = require('../controllers/tokenController')

tokenRouter.post('/create', tokenController.create)
tokenRouter.put('/move', tokenController.move)
tokenRouter.get('/get', tokenController.getAll)

module.exports = tokenRouter