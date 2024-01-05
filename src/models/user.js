const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
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
    }
})

module.exports = User