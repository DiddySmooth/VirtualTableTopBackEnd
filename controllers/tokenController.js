const model = require('../models')
const jwt = require('jsonwebtoken')
const tokenController = {}

///// Add Token to data base linked to game /////
tokenController.create = async (req,res) => {
    try{
        const encryptedGameId = req.body.gameId
        const decryptedGameId = await jwt.verify(encryptedGameId, process.env.JWT_SECRET)

        let token = await model.tokens.create({
            x: req.body.x,
            y: req.body.y,
            picture: req.body.picture,
            name: req.body.name,
            gameId: decryptedGameId.gameId
        })

        res.json({token})

    } catch (error) {
        console.log("🚀 ~ file: tokenController.js ~ line 34 ~ tokenController.create= ~ error", error)
    }
}


///// Edit token x and y after moved on frontend /////
tokenController.move = async (req,res) => {
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
        console.log("🚀 ~ file: tokenController.js ~ line 61 ~ tokenController.move= ~ error", error)
        res.json({error})
    }
}
///// used to get all the tokens and their positions on the board.
tokenController.getAll = async (req,res) => {
    try {
        const encryptedGameId = req.headers.gameid
        const decryptedGameId = await jwt.verify(encryptedGameId, process.env.JWT_SECRET)

        const tokens = await model.tokens.findAll({
            where:{
                gameId: decryptedGameId.gameId
            }
        })
        res.json({tokens})
    } catch (error) {
    console.log("🚀 ~ file: tokenController.js ~ line 64 ~ tokenController.getAll= ~ error", error)
    }
}
module.exports = tokenController