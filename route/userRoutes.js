const express = require('express')

const userRouter = express.Router()

const userController = require('../controllers/usersController')

userRouter.post('/create', userController.create)
userRouter.post('/login', userController.login)
userRouter.get('/getinfo', userController.getInfo)
userRouter.get('/authcheck', userController.authCheck)


module.exports = userRouter