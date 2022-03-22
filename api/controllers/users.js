const { default: mongoose } = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')

module.exports = {
    signup: (req,res) => {
            const {email, password} = req.body

            User.findOne({ email }).then((user) => {
                if(user)
                return res.status(409).json({
                    message: "Email exist"
                })
                
                bcrypt.hash(password, 10, (error, hash) => {
                    if(error)
                        return res.status(500).json({
                            error
                        })
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email,
                        password: hash
                    })
        
                    user.save().then((user) => {
                        console.log(user)
                        res.status(200).json({
                            message: 'User created'
                        })
                    }).catch((error) => {
                        res.status(500).json({
                            error
                        })
                    })
                })
            })
    },
    login: (req,res) => {
        res.status(200).json({
            message: 'login'
        })
    },
}