const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const app = express()

app.use(express.json())

const port = process.env.PORT || 3000

app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then(() => {
        res.send(user)
    }).catch((err) => {
        res.status(400).send(err.message)
    })
})


app.post('/tasks', (req, res) => {
    const task= new Task(req.body)
    task.save().then(() => {
        res.send(task)
    }).catch((err) => {
        res.status(400).send(err.message)
    })
})


app.listen(port,() => {
    console.log('Server started on ' + port)
})