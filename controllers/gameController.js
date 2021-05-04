const model = require('../models')
const jwt = require('jsonwebtoken')
const gameController = {}

gameController.create = async (req,res) => {
    try {
        const encryptedId = req.body.headers.authorization
        const decryptedId = await jwt.verify(encryptedId, process.env.JWT_SECRET)


        let game = await model.game.create({
            title: req.body.body.title,
            password: req.body.body.password,
            userId: decryptedId.userId
        })
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

        let game = await model.game.findOne({
            where: {
                title: req.body.body.title 
            }
        })
        const encryptedId = jwt.sign({gameId: game.id}, process.env.JWT_SECRET)
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
gameController.findOrCreateRecord = async (req,res) => {
    try {
        const encryptedId = req.body.headers.authorization
        const decryptedId = await jwt.verify(encryptedId, process.env.JWT_SECRET)
        const encryptedGameId = req.body.headers.gameauth
        const decryptedGameId = await jwt.verify(encryptedGameId, process.env.JWT_SECRET)
        const foundRecord = await model.userGame.findOne({
            where: {
                userId: decryptedId.userId,
                gameId: decryptedGameId.gameId
            }})

        if (!foundRecord){
            const record = await model.userGame.create({
                userId: decryptedId.userId,
                gameId: decryptedGameId.gameId,
                online: true
            })
            return {record, created: true}
        }
        const record = await model.userGame.update({
            online: true
        })
        
        res.json(record)
    }catch (error){
        console.log(error)
        res.json({message: 'userNotCreated'})
    }
}
gameController.findAllUsers = async (req,res) => {
    try{

        const encryptedGameId = req.headers.gameauth
        const decryptedGameId = await jwt.verify(encryptedGameId, process.env.JWT_SECRET)

        const foundRecord = await model.userGame.findAll({
            where: {
                gameId: decryptedGameId.gameId
            }})

        res.json({foundRecord})
    }catch(error) {
        res.json({error})
    }
}
module.exports = gameController

