const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error('Password can not contain password')
            }
        }
    },
    age: {
        type: Number,
        validate(value){
            if (value < 0){
                throw new Error('Age can not be negative')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.getAuthToken = async function () {
    const user = this

    const token = jwt.sign({_id: user._id.toString()}, 'thisisnodecourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('User Not Found')
    }

    const isValid = await bcrypt.compare(password, user.password)

    if(!isValid){
        throw new Error('Invalid Password')
    }

    return user
}

userSchema.pre('save', async function (next) {

    if(this.isModified('password')){

        this.password = await bcrypt.hash(this.password, 8)

    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User