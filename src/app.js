const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')
const app = express()

app.use(express.json())

const port = process.env.PORT || 3000

app.use(userRouter)
app.use(taskRouter)


app.listen(port,() => {
    console.log('Server started on ' + port)
})