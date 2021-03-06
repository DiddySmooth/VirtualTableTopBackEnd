const model = require('../models')
const jwt = require('jsonwebtoken')
const chatController = {}


///// Called Whenever someone sends a chat message /////
chatController.create = async (req,res) => {
    try {
        const encryptedId = req.body.headers.authorization
        const decryptedId = await jwt.verify(encryptedId, process.env.JWT_SECRET)
        const encryptedGameId = req.body.headers.gameauth
        const decryptedGameId = await jwt.verify(encryptedGameId, process.env.JWT_SECRET)

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
        console.log("🚀 ~ file: chatController.js ~ line 28 ~ chatController.create= ~ error", error)
        res.json({
            error
        })
    }
}

///// used to populate chat /////
chatController.getall = async (req, res) => {

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
    console.log("🚀 ~ file: chatController.js ~ line 49 ~ chatController.getall= ~ error", error)
        res.json({
            error
        })
    }
}

module.exports = chatController