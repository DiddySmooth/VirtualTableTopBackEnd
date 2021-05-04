const model = require('../models')
const jwt = require('jsonwebtoken')
const tokenController = {}

tokenController.create = async (req,res) => {
    console.log(req.body)
    try{
        const encryptedGameId = req.body.gameId
        
        const decryptedGameId = await jwt.verify(encryptedGameId, process.env.JWT_SECRET)
        console.log(decryptedGameId, "-------------------------")

        let token = await model.tokens.create({
            x: req.body.x,
            y: req.body.y,
            picture: req.body.picture,
            name: req.body.name,
            gameId: decryptedGameId.gameId
        })
        res.json({token})
    } catch (error) {
        console.log(error)
    }
}

tokenController.move = async (req,res) => {
    console.log(req.body)
    try {
        const encryptedGameId = req.body.gameId
        const decryptedGameId = await jwt.verify(encryptedGameId, process.env.JWT_SECRET)

        const foundToken = await model.tokens.findOne({
            where: {
                name: req.body.name,
                gameId: decryptedGameId.gameId
            }
        })
        let res = await foundToken.update({
            name: req.body.name,
            x: req.body.x,
            y: req.body.y
        })
        res.json({res})
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}
tokenController.getAll = async (req,res) => {
    console.log(req.headers.gameid)
    try {
        const encryptedGameId = req.headers.gameid
        const decryptedGameId = await jwt.verify(encryptedGameId, process.env.JWT_SECRET)

        console.log(decryptedGameId)
        const tokens = await model.tokens.findAll({
            where:{
                gameId: decryptedGameId.gameId
            }
        })
        res.json({tokens})
    } catch (error) {
        console.log(error, "------------------")
    }
}
module.exports = tokenController