const express = require('express')
const User = require('../models/user')

const router = new express.Router()

router.post('/users', async (req, res) => {
    
    const user = new User(req.body)
    try {
        await user.save()
        res.send(user)
    } 
    catch (err) {
        res.status(400).send(err.message)
    }
    
})

router.get('/users',async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
        
    } catch (error) {
        res.status(500).send(error.message)    
    }

})

router.get('/users/:id', async (req, res) => {

    const _id = req.params.id
    
    try {
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }
     catch (err) {
        res.status(400).send(err.message)
    }

})

router.patch('/users/:id',async (req, res) => {

    const allowableUpdates = ['name', 'email', 'password', 'age']
    const updates = Object.keys(req.body)
    const isValidUpdates = updates.every((update) => allowableUpdates.includes(update))

    if(!isValidUpdates || !req.body ){
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {

       const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

       if(!user){
        return res.status(404).send()
       }

       res.send(user)
        
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    }
    catch(e) {
        res.status(400).send()
    }
})

module.exports = router