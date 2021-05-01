const model = require('../models')
const jwt = require('jsonwebtoken')
const chatController = {}

chatController.create = async (req,res) => {
    console.log(req.body.body.body)
    try {
        const encryptedId = req.body.headers.authorization
        const decryptedId = await jwt.verify(encryptedId, process.env.JWT_SECRET)
        const encryptedGameId = req.body.headers.gameauth
        const decryptedGameId = await jwt.verify(encryptedGameId, process.env.JWT_SECRET)
        console.log(decryptedId, decryptedGameId)
        let chat = await model.chat.create({
            body: req.body.body.body,
            author: req.body.body.author,
            userId: decryptedId.userId,
            gameId: decryptedGameId.gameId
        })
        res.json({
            message:"Done",
            chat: chat
        })
    } catch (error) {
        console.log(error)
        res.json({
            error
        })
    }
}

chatController.getall = async (req, res) => {
    console.log(req.body)
    try{
        const encryptedId = req.headers.gameauth
        const decryptedId = await jwt.verify(encryptedId, process.env.JWT_SECRET)
        
        const chats = await model.chat.findAll({
            where: {
                gameId: decryptedId.gameId
            }
        })
       
        res.json({
            chats: chats
        })    
    }
    catch (error) {
        res.json({
            error
        })
    }
}

module.exports = chatController