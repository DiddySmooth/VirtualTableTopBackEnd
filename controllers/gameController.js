const model = require('../models')
const jwt = require('jsonwebtoken')
const gameController = {}

///// Called when user creates their own game /////
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
        console.log("🚀 ~ file: gameController.js ~ line 25 ~ gameController.create= ~ error", error)
        res.json({
            error
        })
    }
}
///// user logs in to existing game //////
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
        console.log("🚀 ~ file: gameController.js ~ line 63 ~ gameController.login= ~ error", error)
        res.status(400),
        res.json({ error: 'login failed'})  
    }
}
///// used to get info on page refresh return game object  /////
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
        console.log("🚀 ~ file: gameController.js ~ line 71 ~ gameController.getInfo= ~ error", error)
        res.json({
            error
        })
    }
}
///// used to verify that user local storage gameId is a valid id /////
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
        console.log("🚀 ~ file: gameController.js ~ line 98 ~ gameController.authCheck= ~ error", error)
        res.json({message: 'not verified'})
    }
}

// Allows users to join into existing games adding them to the game if 
// they have not joined before or just marking them online if they have joined. 

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
        const record = foundRecord.update({
            online: true
        })
        
        res.json(record)
    }catch (error){
        console.log("🚀 ~ file: gameController.js ~ line 130 ~ gameController.findOrCreateRecord= ~ error", error)
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
        console.log("🚀 ~ file: gameController.js ~ line 158 ~ gameController.findAllUsers= ~ error", error)
        res.json({error})
    }
}

///// sets users state in game to offline /////
gameController.logout = async (req, res) => {
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
        const record = foundRecord.update({
            online: false
        })
    } catch (error) {
    console.log("🚀 ~ file: gameController.js ~ line 159 ~ gameController.logout= ~ error", error)
        
    }
}

///// sets users state in game to online /////
gameController.loginFast = async (req, res) => {
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
            const record = foundRecord.update({
                online: true
            })

        } catch (error) {
        console.log("🚀 ~ file: gameController.js ~ line 159 ~ gameController.logout= ~ error", error)
            
        }
    }
module.exports = gameController

