const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {

    try{

        const token = req.header('Authorization').replace('Bearer ','')
        console.log(token)
        const decode = jwt.verify(token, 'thisisnodecourse')
        const user = await User.findOne({_id: decode._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }

        req.user = user

        next()
    }
    catch(e) {
        res.status(401).send({error: 'User is not authorized'})
    }

}

module.exports = auth