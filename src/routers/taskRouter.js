const express = require('express')
const Task = require('../models/task')

const router = new express.Router()

router.post('/tasks', async (req, res) => {

    const task = new Task(req.body)

    try{
        await task.save()
        res.send(task)
    }
    catch(err){
        res.status(400).send(err.message)     
    }
})

router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error.message)    
    }

})

router.get('/tasks/:id', async (req, res) => {

    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
   
    } 
    catch (err) {
        res.status(400).send(err.message)
    }
})

router.patch('/tasks/:id', async (req, res) => {

    const allowableUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidUpdates = updates.every((update) => allowableUpdates.includes(update))

    if(!isValidUpdates || !req.body ){
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {

        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
 
        if(!task){
         return res.status(404).send()
        }
 
        res.send(task)
         
     } catch (error) {
         res.status(400).send(error.message)
     }

})

router.delete('/tasks/:id', async (req, res) => {

    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }
    catch(e) {
        res.status(400).send()
    }
})

module.exports = router
