const model = require('../models')
const jwt = require('jsonwebtoken')
const gameController = {}

gameController.create = async (req,res) => {
    try {
        console.log(req.body.headers.authorization)
        console.log(req.body.headers)
        const encryptedId = req.body.headers.authorization
        console.log(encryptedId)
        const decryptedId = await jwt.verify(encryptedId, process.env.JWT_SECRET)

        let game = await model.game.create({
            title: req.body.body.title,
            password: req.body.body.password,
            userId: decryptedId.userId
        })
        console.log(req.headers)
        const encryptedGameId = jwt.sign({gameId: game.id}, process.env.JWT_SECRET)
        res.json({
            message:"done",
            game: game,
            gameId: encryptedGameId,
        })
    } catch (error) {
        console.log(error)
        res.json({
            error
        })
    }
}

gameController.login = async (req,res) => {
    try {
        console.log(req.body.body)
        let game = await model.game.findOne({
            where: {
                title: req.body.body.title 
            }
        })
        const encryptedId = jwt.sign({gameId: game.id}, process.env.JWT_SECRET)
        console.log(game)
        if(game.password === req.body.body.password) {
            res.json({
                game,
                encryptedId
        })
        } else {
            res.status(401)
            res.json({error: 'login failed'})
        }

    } catch (error) {
        res.status(400),
        res.json({ error: 'login failed'})  
    }
}

gameController.getInfo = async (req, res) => {
    try{
        const encryptedId = req.headers.gameauth
        console.log(req.headers)
        const decryptedId = await jwt.verify(encryptedId, process.env.JWT_SECRET)
        
        const game = await model.game.findOne({
            where: {
                id: decryptedId.gameId
            }
        })
       
        res.json({
            game: game
        })    
    }
    catch (error) {
        res.json({
            error
        })
    }
}
gameController.authCheck = async (req,res) => {
    try {
        const encryptedId = req.headers.gameauth
        const decryptedId = await jwt.verify(encryptedId, process.env.JWT_SECRET)
        const game = await model.game.findOne({
        where: {
            id: decryptedId.gameId
        }
    })
    res.json({game: game.id})
    } catch (error) {
        res.json({message: 'not verified'})
    }
}

module.exports = gameController

